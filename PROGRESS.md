# Progress

## Step 1: Breast Cancer
- git init, cloned repo to breast/
- Created pcos/, backend/, frontend/
- Sigmoid output = P(benign) (malignant_probability = 1 - P(benign))
- FastAPI backend with POST /breast/predict, CORS, loads breast_cancer_ann.keras and scaler.pkl
- Tested with malignant/benign samples

## Step 2: PCOS
- Copied PCOS_data.csv to pcos/PCOS_data.csv (541, 45)
- Initial 11 features - fixed feature order, scaling once, input-dependent top_factors
- Removed Cycle length(days) - retrained with 10 features
- Features: Age (yrs), BMI, Cycle(R/I) [5->4], Weight gain(Y/N), hair growth(Y/N), Skin darkening (Y/N), Hair loss(Y/N), Pimples(Y/N), Fast food (Y/N) [NaN->0], Reg.Exercise(Y/N)
- LR (class_weight balanced, scaler) default; XGBoost (n_estimators=150,max_depth=3,lr=0.05,subsample=0.8)
- Comparison table updated, calibration curve and SHAP for XGBoost saved
- POST /pcos/predict updated (10 fields), returns probability, risk_band, top_factors, disclaimer
