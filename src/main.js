const core = require('@actions/core')
const github = require('@actions/github')

async function getJobStatus(token, runId, context) {
  const octokit = github.getOctokit(token)
  const { data: workflow } = await octokit.rest.actions.getWorkflowRun({
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: runId
  })
  return workflow.status
}

async function run() {
  try {
    const token = core.getInput('token')
    const runMain = core.getInput('run_main') === 'true'
    const runPost = core.getInput('run_post') === 'true'
    const { context } = github
    const runId = context.runId

    if (runMain) {
      core.info('Running main job step...')
      // Simulate job running
      await new Promise(resolve => setTimeout(resolve, 2000))
      core.info('Main job step completed.')
    }

    if (runPost) {
      // Post-run: Get job status after the main job step
      const postStatus = await getJobStatus(token, runId, context)
      core.setOutput('post_status', postStatus)
      core.info(`Job status after run: ${postStatus}`)
    }

    if (!runMain && !runPost) {
      core.setFailed(
        'No valid input specified: run_main or run_post must be true.'
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
