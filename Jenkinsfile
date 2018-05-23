#!/usr/bin/env groovy

@Library("com.optum.jenkins.pipeline.library@master") _

pipeline {
  agent {
    label 'docker-node-slave'
  }
  tools { 
    nodejs 'NodeJS 6.5.0'
  }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    GIT_CREDENTIALS_ID = 'd296d826-c6ae-47c8-be84-d89883581cf8'
    NODEJS_VERSION = '6.5.0'
    PIPELINE_VERSION = "myoptum-libraries-1.0.0.${BUILD_NUMBER}-${env.BRANCH_NAME}"
  }
  stages {
    stage ('Install dependencies') {
      steps {
        script {
          currentBuild.displayName = "${PIPELINE_VERSION}"
        }
        sh 'npm set registry https://registry.npmjs.org/'

        sh 'npm-cache clean'
        sh 'npm-cache install npm'

        sh 'npm --version'
        sh 'node --version'
      }
    }
    stage ('Test') {
      steps {
        sh 'npm run test:all'
      }
    }
    stage ('Build') {
      steps {
        sh '''
        npm run build
        '''
      }
      post {
        success {
          archiveArtifacts(artifacts: 'dist/*/*.js,coverage/*', allowEmptyArchive: true)
        }
      }
    }
    stage('Sonar') {
      when {
        anyOf {
          branch 'master'
          branch 'develop'
        }
      }
      steps {
        glSonarNpmScan additionalProps:['sonar.javascript.lcov.reportPaths':'coverage/lcov.info'],
          sonarExclusions:"test/**/*,test-setup/**/*,coverage/**/*",
          sonarCoverageExclusions:"test/**/*,test-setup/**/*,coverage/**/*",
          gitUserCredentialsId:"${env.GIT_CREDENTIALS_ID}"
      }
    }
    stage('Send to Promotion job') {
      when {
        anyOf {
          branch 'master'
          branch 'develop'
        }
      }
      steps {
        build job: "../Libraries-promote", parameters: [[$class: 'StringParameterValue', name: 'PIPELINE_VERSION', value: PIPELINE_VERSION],[$class: 'StringParameterValue', name: 'BRANCH_TO_BUILD', value: env.BRANCH_NAME]], wait: false
      }
    }
  }
}
