import { spawn } from 'child_process';

// const ClaudeCli = ['claude', '--print', '--allowedTools', 'Edit,Bash(git:*)'];
const AIAgentCli = ['cursor', '--print'];

export async function runSubprocess(prompt: string) {
  console.log('Running claude with prompt from STDIN...');
  return new Promise((resolve, reject) => {
    const process = spawn(AIAgentCli[0], AIAgentCli.slice(1), {
      stdio: ['pipe', 'inherit', 'inherit'],
    });

    // Write the prompt to STDIN immediately
    process.stdin.write(prompt);
    process.stdin.end();

    process.on('close', (code) => {
      if (code === 0) {
        resolve('');
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

export async function remediate(problems: (() => Promise<string>)[]) {
  console.log(`\nStarting remediation for ${problems.length} issues...\n`);

  for (const [i, p] of problems.entries()) {
    let prompt = await p();
    prompt = `You are a helpful software professional. Please fix the issue described below.
    When you're done, please provide a brief explanation of the changes you made.
    If you don't have permissions or for some other reason cannot make the change, exit quickly and say why.
    \n\n${prompt}`;
    console.log(`Remediating issue ${i + 1}/${problems.length}...`);
    console.log(`Prompt: ${prompt}`);
    await runSubprocess(prompt);
    console.log(`✓ Completed remediation for issue ${i + 1}`);
  }
}
