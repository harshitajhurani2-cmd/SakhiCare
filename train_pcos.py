import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, recall_score, precision_score, confusion_matrix
from xgboost import XGBClassifier
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.calibration import calibration_curve
import shap

df = pd.read_csv('pcos/PCOS_data.csv')
print('Shape:', df.shape)

features = [' Age (yrs)', 'BMI', 'Cycle(R/I)', 'Cycle length(days)', 
            'Weight gain(Y/N)', 'hair growth(Y/N)', 'Skin darkening (Y/N)',
            'Hair loss(Y/N)', 'Pimples(Y/N)', 'Fast food (Y/N)', 'Reg.Exercise(Y/N)']
target = 'PCOS (Y/N)'

X = df[features].copy()
y = df[target].copy()

X['Cycle(R/I)'] = X['Cycle(R/I)'].replace(5, 4)
X['Fast food (Y/N)'] = X['Fast food (Y/N)'].fillna(0)

for col in X.columns:
    X[col] = pd.to_numeric(X[col], errors='coerce')
    X[col] = X[col].fillna(X[col].median())

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

lr = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
xgb = XGBClassifier(n_estimators=150, max_depth=3, learning_rate=0.05, subsample=0.8, random_state=42, eval_metric='logloss')

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
lr_cv_auc = cross_val_score(lr, X_train_scaled, y_train, cv=cv, scoring='roc_auc').mean()
xgb_cv_auc = cross_val_score(xgb, X_train, y_train, cv=cv, scoring='roc_auc').mean()

lr.fit(X_train_scaled, y_train)
xgb.fit(X_train, y_train)

lr_pred_proba = lr.predict_proba(X_test_scaled)[:, 1]
xgb_pred_proba = xgb.predict_proba(X_test)[:, 1]

lr_test_auc = roc_auc_score(y_test, lr_pred_proba)
xgb_test_auc = roc_auc_score(y_test, xgb_pred_proba)

thresh = 0.4
lr_pred_04 = (lr_pred_proba >= thresh).astype(int)
xgb_pred_04 = (xgb_pred_proba >= thresh).astype(int)

lr_recall = recall_score(y_test, lr_pred_04)
lr_precision = precision_score(y_test, lr_pred_04)
xgb_recall = recall_score(y_test, xgb_pred_04)
xgb_precision = precision_score(y_test, xgb_pred_04)

lr_cm = confusion_matrix(y_test, lr_pred_04)
xgb_cm = confusion_matrix(y_test, xgb_pred_04)

print('=== COMPARISON ===')
print(f'Model                5-fold CV AUC    Test AUC     Recall@0.4   Precision@0.4')
print('-'*75)
print(f'LogisticRegression   {lr_cv_auc:.4f}           {lr_test_auc:.4f}       {lr_recall:.4f}       {lr_precision:.4f}')
print(f'XGBoost              {xgb_cv_auc:.4f}           {xgb_test_auc:.4f}       {xgb_recall:.4f}       {xgb_precision:.4f}')
print('\nLR Confusion Matrix (@0.4):')
print(lr_cm)
print('\nXGB Confusion Matrix (@0.4):')
print(xgb_cm)

joblib.dump(lr, 'pcos/lr_model.pkl')
joblib.dump(scaler, 'pcos/lr_scaler.pkl')
joblib.dump(xgb, 'pcos/xgb_model.pkl')
joblib.dump(features, 'pcos/features.pkl')
print('\nSaved models to pcos/')

plt.figure(figsize=(8,6))
prob_true_lr, prob_pred_lr = calibration_curve(y_test, lr_pred_proba, n_bins=10)
prob_true_xgb, prob_pred_xgb = calibration_curve(y_test, xgb_pred_proba, n_bins=10)
plt.plot(prob_pred_lr, prob_true_lr, marker='o', label='Logistic Regression')
plt.plot(prob_pred_xgb, prob_true_xgb, marker='s', label='XGBoost')
plt.plot([0,1],[0,1], linestyle='--', label='Perfectly calibrated')
plt.xlabel('Mean predicted probability')
plt.ylabel('Fraction of positives')
plt.title('Calibration Curve')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig('pcos/calibration_curve.png', dpi=150)
plt.close()
print('Saved calibration_curve.png')

explainer = shap.TreeExplainer(xgb)
shap_values = explainer.shap_values(X_test)
plt.figure(figsize=(10,8))
shap.summary_plot(shap_values, X_test, show=False)
plt.tight_layout()
plt.savefig('pcos/shap_summary.png', dpi=150, bbox_inches='tight')
plt.close()
print('Saved shap_summary.png')
