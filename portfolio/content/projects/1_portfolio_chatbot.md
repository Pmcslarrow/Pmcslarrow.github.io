---
title: "Portfolio Agent"
description: "Built an agent to help users learn more about me on my portfolio without having to manually search for content."
date: 2025-10-01
tags: ["python", "gcp", "AI"]
weight: 1
---

<div>
    <img 
        src="/images/portfolio/agent.png" 
        alt="Example of my portfolio agent"
        width="250px"
        style="display: block; margin: 0 auto;"
    />
</div>

## Code

- The only code written for this project was setting up a Cloud Run function on GCP that feeds context to the agent.  
- The agent determines what the user is requesting regarding projects and passes a parameter specifying which resource it wants to retrieve information for. The script then returns plaintext to the agent with the content that actually lives on my portfolio.

## Overview

I thought it would be both fun and useful to create a simple agent that can live on my personal portfolio. The agent's goal is to help users learn more about me! Users can ask personal questions as well as specific questions about my projects.

## Summary

- The agent uses a text file containing personal information about me (education, hobbies, contact info, etc.) that it can utilize as context when necessary.  
- When the user requests information about projects, the agent calls a GCP Cloud Run function I built. If the user asks a general question like "Tell me about the projects Paul has worked on," it returns a high-level overview of most of my projects. For more specific questions, like "Tell me about Paul's recommender system projects," it provides detailed information about my Wide and Deep learning recommender system projects and more.
