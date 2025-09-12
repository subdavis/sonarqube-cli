import { RuleRepository, Rule } from '../types/rule';
import chalk from 'chalk';

export function formatRuleRepository(repo: RuleRepository): string {
  return [
    chalk.blue.bold(repo.key),
    chalk.cyan(repo.name),
    chalk.gray(`[${repo.language}]`)
  ].join(' ');
}

export function formatRule(rule: Rule): string {
  const typeColor = rule.type === 'BUG' ? chalk.red : 
                   rule.type === 'VULNERABILITY' ? chalk.magenta : 
                   rule.type === 'SECURITY_HOTSPOT' ? chalk.yellow : 
                   chalk.blue;
  
  const severityColor = rule.severity === 'BLOCKER' ? chalk.red : 
                       rule.severity === 'CRITICAL' ? chalk.red : 
                       rule.severity === 'MAJOR' ? chalk.yellow : 
                       rule.severity === 'MINOR' ? chalk.blue : 
                       chalk.gray;

  return [
    chalk.blue.bold(rule.key),
    chalk.white(rule.name),
    typeColor(`[${rule.type}]`),
    severityColor(`${rule.severity}`),
    chalk.gray(`${rule.lang}`)
  ].join(' ');
}