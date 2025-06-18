---
title: "Morphological Classification of Cells in Histology Images"
description: ""
date: 2024-05-01
tags: ["ML", "DL", "Python", "PyTorch"]
weight: 7
---

## Overview
This was Michael Bertagna and my final project for our introduction to machine learning class. We designed a convolutional neural network (CNN) that takes in images of cell types, and attempts to classify them. We were able to achieve significant improvements compared to the KNN baseline used.

## Results

#### KNN Baseline Results
```
                precision    recall  f1-score   support
accuracy                               0.27       259
macro avg          0.14      0.15      0.14       259
weighted avg       0.24      0.27      0.23       259
```

#### CNN Results

```
                precision    recall  f1-score   support
accuracy                               0.71      5143
macro avg          0.66      0.54      0.55      5143
weighted avg       0.71      0.71      0.70      5143
```

## Presentation

![Link](#)