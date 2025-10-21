---
title: "Wide and Deep Learning for Recommender Systems"
description: "Built a version of the Wide and Deep Learning paper for book recommendations"
date: 2025-08-01
tags: ["python", "pytorch", "pandas", "ML", "DL"]
weight: 1
---

## Code

- The code can be found [within this PDF](/images/wide_and_deep/wide_and_deep.pdf)
- Can also be found within this repo at static/images/wide_and_deep/wide_and_deep.pdf

## Overview

This is a passion project I've been working on to deepen my understanding of recommender systems in my free time. While I've previously implemented simpler methods—such as matrix factorization or with basic content-based filtering, this project is my attempt to implement a more elegant solution inspired by [this paper](https://arxiv.org/abs/1606.07792).

## Architecture Summary

The model processes inputs related to **user–item pairs** and leverages two components:

- **Wide component**: uses cross-products to _memorize_ feature interactions.
- **Deep component**: employs a neural network to _generalize_ to unseen feature combinations.

The outputs of these two components are combined and updated jointly, with the goal of predicting whether a user would like a given item based on an explicit rating.

While the ratings in the dataset are between 0 and 5, I simplified the rating to be 1 for ratings >= 4 and 0 otherwise. With a binary goal in mind, we are able to train our model using binary cross-entropy loss (BCE).



<div>
    <img 
        src="/images/wide_and_deep/fig_1.png" 
        alt="Wide and Deep learning architecture"
        style="display: block; margin: 0 auto;"
    />
</div>


---

## Feature Engineering

The paper mentioned the utilization of **cross-embeddings**; however, I chose a different approach for this implementation.

- For the **wide (linear) component**, I transformed the continuous variables (`user_id`, `book_id`) into **one-hot embeddings**.
- For the **deep component**, I followed the paper’s suggestion and used an **embedding layer** to capture more complex relationships across features (`user_id`, `book_id`, and `genre`).

---

## Summary

While the model may not have captured much signal (or may have overfit the training set), I used **AUC** to evaluate its ability to distinguish between positive and negative classes on the test set. With random guessing, the AUC would be around **0.5**, regardless of the class distribution.

In this dataset, about **68%** of the examples were positive, and the model still achieved **fair performance** given the limited feature set (_user ID, book ID, and a single genre_). With additional metadata, the model would likely have identified stronger patterns between features and labels.

**Overall, this can be considered a successful result.**
