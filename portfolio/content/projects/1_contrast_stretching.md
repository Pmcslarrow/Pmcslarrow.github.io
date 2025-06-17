---
title: "High-Performance Image Processing via Parallel Contrast Stretching"
description: "Built with MPI in C++"
date: 2024-05-01
tags: ["c++", "mpi", "hpc", "parallel"]
weight: 1
---

### Overview

This project parallelized a sequential contrast stretching algorithm using MPI to create a distributed solution. I achieved approximately a 10× speedup compared to the sequential version. Before arriving at the distributed solution, I also parallelized the algorithm using OpenMP for a shared-memory implementation. However, the more interesting and impactful result was the distributed solution, which also accounted for complexities such as halo rows.

### Problem Statement

Contrast stretching is an image enhancement technique that improves the clarity of an image by expanding the range of intensity values. 

To achieve this, you can think of it as a nearest neighbors problem, where the newly updated pixel value is dependant on the pixels surrounding it.

![Contrast stretching image](/images/contrast_stretching/contrast.png)

Pretty simple... The sequential solution to this is as simple as 
iterating over all the pixels in the matrix (not including the boundaries) and adjusting the pixels.

The complexity comes when parallelizing this solution. To achieve this with MPI, we could make it very easy on ourselves and send the entire up-to-date image to each worker, and have them process the portion of the image that they need to process, and then send back the entire updated image, and have the main process stitch it back in. 

This, however, is extremely inefficient when it comes to memory efficiency. Therefore, the best solution to this problem is to send chunks of rows to each worker, and have each worker process the appropriate rows and send back the processed rows for the main process to gather. 

![Contrast stretching image](/images/contrast_stretching/scattering.png)

This is what this project successfully accomplishes at a high level, but there are three other problems that we must understand in more detail before discussing the implementation. 


### Problem 1: Ghost Rows

Recall that this is a nearest neighbor algorithm that relies on the pixels around to make the calculation. When we split the image into chunks, each worker (including the main process) is missing the rows surrounding the chunk to be able to make the correct calculations. 

For example, if we look at worker 1 in the image above (second from the left), to be able to calculate the correct values for the top and bottom rows in the chunk, we actually need the up-to-date rows from the workers around it. This means, for worker 1, it needs the top row from worker 2, and needs the bottom row from worker 0. 

![Contrast stretching image](/images/contrast_stretching/ghost_rows.png) 


### Problem 2: Alignment / Convergence

### Problem 3: 