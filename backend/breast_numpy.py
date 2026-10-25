import json
from pathlib import Path
import numpy as np

_W = json.loads((Path(__file__).parent / "breast_weights.json").read_text())
_MEAN = np.array(_W["mean"], dtype=np.float64)
_SCALE = np.array(_W["scale"], dtype=np.float64)
_LAYERS = [(np.array(l["W"]), np.array(l["b"]), l["act"]) for l in _W["layers"]]


def predict_benign(features):
    x = (np.array(features, dtype=np.float64).reshape(1, -1) - _MEAN) / _SCALE
    for W, b, act in _LAYERS:
        x = x @ W + b
        if act == "relu":
            x = np.maximum(x, 0)
        elif act == "sigmoid":
            x = 1.0 / (1.0 + np.exp(-x))
    return float(x[0][0])
