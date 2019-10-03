# Asana

We know now. Asana is a terrible tool for managing software projects. Yet the experiments continue in many companies who have fallen for the idea that you can actually manage software project with a glorified TODO list.

This extension is meant to alleviate at least some of the pain.

## Features

Allows to quickly search for Asana tasks, and copy the task Id or URL

## Quickstart

Head over to https://app.asana.com/-/developer_console , create Personal Access Token, and copy it.
Either put the token, in the extension settings, or simply run a command from the extension and you will be asked for the token.

## Commands

* `Asana: Copy Task Id` -  search tasks, and copy the Id of the selected task to clipboard
* `Asana: Copy Task URL` -  search tasks, and copy the URL of the selected task to clipboard
* `Asana: Configure projects` - select which projects to be used for searching tasks, defaults to all

## Extension Settings

This extension contributes the following settings:

* `asana.apiToken`: Asana API personal access token, you can get yours at https://app.asana.com/-/developer_console
* `asana.workspaceId`: Workspace Id to use
* `asana.selectedProjects`: List of projects id, which to use for searching tasks
* `asana.prependStringToTaskNumber`: String to prepend when copying asana task Id
* `asana.searchAssignedToMeOnly`:  If true search only assigned tasks, else search followed

## Release Notes

### 0.0.1

Initial release , only search and copy task Id/URL is supported.
