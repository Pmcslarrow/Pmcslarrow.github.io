---
title: "DL HW3 (GANs)"
description: "Insert"
date: 2024-05-01
tags: ["ML", "DL", "Python", "PyTorch"]
weight: 5
---

## Note to reader

*I do not include large code snippets as this was an assignment for my deep learning course at Northwestern and I don't want future students copying it. It exists in a private repo of mine containing my school assignments. I will try to do my best to illustrate the work I did with fewer code examples*

## Overview

This assignment focused on Generative Adversarial Networks (GANs), adversarial examples, model collapse, and latent interpolation. We will touch on Adversarial examples and GANs

## Adversarial Examples

#### What are Adversarial Examples?

Adversarial examples are a suite of methods employed by adversaries to exploit the vulnerabilities inherent in ML models, focusing particularly on the optimization processes these models utilize to learn and make prediction

For example, a model is always going to be an output based on the network architecture and biases, not actually on the data. This is an important note because it means that an adversary can exploit gradient-based updates by slightly adjusting the input values to maximize the loss rather than minimize it. In doing so, it can seem that nothing changed in the input to the human eye, but to the model, it could be all the difference between a correct or an incorrect classification. 

#### An example

We could have a simple FFNN that takes an input image, and it has a class associated with it. In the example below, we as humans know that this is a picture of a panda. However, by adjusting the pixels ever-so-slightly utilizing gradient-based attacks, the model actually classified this image as "bucket". 

{{< rawhtml >}}
<div>
    <img 
        src="/images/dl_hw3/panda.png" 
        alt="Panda adversarial example network"
        width="500px"
        style="display: block; margin: 0 auto;"
    />
</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<div>
    <img 
        src="/images/dl_hw3/panda_wrong.png" 
        alt="Adversarial example"
        width="500px"
        style="display: block; margin: 0 auto;"
    />
</div>
{{< /rawhtml >}}


#### Gradient-based attack to misclassify digits from MNIST


{{< rawhtml >}}
<div>
    <img 
        src="/images/dl_hw3/adversarial_example.png" 
        alt="Adversarial example"
        width="500px"
        style="display: block; margin: 0 auto;"
    />
</div>
{{< /rawhtml >}}

```python
# ...
# ...

step_size = 0.1
for i in range(1, 25):
    delta.grad = None

    #
    # Compute model's class scores given perturbed input (x + delta)
    #
    outputs = model(x + delta)
    loss = torch.nn.functional.nll_loss(outputs, target)

    #
    # Compute gradient of loss w.r.t. our perturbation
    #
    loss.backward()
    grad = delta.grad.detach()

    #
    # Update our perturbation to descend the loss toward the incorrect class
    #
    with torch.no_grad():
        delta -= torch.sign(grad) * step_size
        delta.clip_(min=-0.4, max=0.4)

# ...
# ...
```



## Generative Adversarial Networks (GANs)

#### What is a GAN?
Generative Adversarial Networks (GANs) consist of two neural networks—a generator and a discriminator—trained in opposition: the generator tries to *produce realistic data to fool the discriminator*, while the discriminator learns to distinguish between real and fake data. The generator never sees real data directly and learns only through feedback from the discriminator. Key challenges include maintaining a learning balance between both networks and avoiding *mode collapse*, where the generator produces limited or repetitive outputs instead of diverse samples.

#### The beauty in the architecture
The beauty of a GAN's architecture lies in its adversarial nature. It can be thought of as a minimax game between two competing neural networks: the generator and the discriminator. The generator aims to create data that is indistinguishable from real data, while the discriminator tries to correctly distinguish real data from generated data. As training progresses, both networks improve — the generator becomes better at fooling the discriminator, and the discriminator becomes better at detecting fakes. Ideally, this adversarial process reaches an equilibrium where the generator's outputs are so realistic that the discriminator can no longer confidently tell them apart from real data.

#### Training and generated examples from a CNN-based GAN

{{< rawhtml >}}
<div>
    <img 
        src="/images/dl_hw3/discriminator_scores.png" 
        alt="Adversarial example"
        width="500px"
        style="display: block; margin: 0 auto;"
    />
</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<div>
    <img 
        src="/images/dl_hw3/generated_images.png" 
        alt="Adversarial example"
        width="500px"
        style="display: block; margin: 0 auto;"
    />
</div>
{{< /rawhtml >}}