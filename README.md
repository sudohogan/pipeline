# Jenkins Pipeline Setup Guide

## Table of Contents
1. [Shared Libraries](#shared-libraries)
2. [Docker Image Deployment](#docker-image-deployment)
3. [SonarQube Scanning](#sonarqube-scanning)
4. [Telegram Alerts](#telegram-alerts)
5. [Required Credentials](#required-credentials)
6. [Troubleshooting](#troubleshooting)

## Shared Libraries <a name="shared-libraries"></a>
The pipeline uses Jenkins Shared Libraries for reusable functions and configurations.

```groovy
@Library('shared-lib@main') _
```
refferences my repositories main branch where 