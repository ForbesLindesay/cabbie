import {readFileSync} from 'fs';
import {parse as parseEnv} from 'dotenv';
import {Options} from './flow-types/options';
const getBrowser = require('available-browsers');

interface RemoteConfig {
  url: (options: Options) => string;
  addCapabilities?: (
    options: Options,
    capabilities: {[key: string]: string},
  ) => void;
  validateOptions?: (options: Options) => void;
  supportsBrowser?: boolean;
}

export const ENVIRONMENT_ALIASES: {[key: string]: keyof Options} = {
  SAUCE_USERNAME: 'sauceUsername',
  SAUCE_ACCESS_KEY: 'sauceAccessKey',
  BROWSER_STACK_USERNAME: 'browserStackUsername',
  BROWSER_STACK_ACCESS_KEY: 'browserStackAccessKey',
  TESTING_BOT_KEY: 'testingBotKey',
  TESTING_BOT_SECRET: 'testingBotSecret',
  SELENIUM_HUB_PORT: 'seleniumHubPort',

  // deprecated aliases
  TESTINGBOT_KEY: 'testingBotKey',
  TESTINGBOT_SECRET: 'testingBotSecret',
};

export const REMOTE_ALIASES: {[key: string]: string} = {
  'chrome-driver': 'chromedriver',
  'taxi-rank': 'taxirank',
  'sauce-labs': 'saucelabs',
  'browser-stack': 'browserstack',
  'testing-bot': 'testingbot',
  'selenium-hub': 'seleniumhub',
};

export const REMOTE_CONFIGS: {[key: string]: RemoteConfig} = {
  chromedriver: {
    url: () => 'http://localhost:9515/',
  },
  seleniumhub: {
    url: options =>
      `http://localhost:${options.seleniumHubPort || 4444}/wd/hub`,
  },
  taxirank: {
    url: () => 'http://localhost:9516',
    supportsBrowser: true,
  },
  saucelabs: {
    validateOptions: ({sauceUsername, sauceAccessKey}) => {
      if (!sauceUsername || !sauceAccessKey) {
        throw new Error(
          'To use sauce labs, you must specify SAUCE_USERNAME and SAUCE_ACCESS_KEY in enviornment variables or ' +
            'provide sauceUsername and sauceAccessKey as options.',
        );
      }
    },
    url: ({sauceUsername, sauceAccessKey}) =>
      `http://${sauceUsername}:${sauceAccessKey}@ondemand.saucelabs.com/wd/hub`,
    supportsBrowser: true,
  },
  browserstack: {
    validateOptions: ({browserStackUsername, browserStackAccessKey}) => {
      if (!browserStackUsername || !browserStackAccessKey) {
        throw new Error(
          'To use browserstack, you must specify BROWSER_STACK_USERNAME and BROWSER_STACK_ACCESS_KEY in ' +
            'enviornment variables or provide browserStackUsername and browserStackAccessKey as options.',
        );
      }
    },
    url: () => 'http://hub-cloud.browserstack.com/wd/hub',
    addCapabilities: (
      {browserStackUsername, browserStackAccessKey},
      capabilities,
    ) => {
      capabilities['browserstack.user'] = browserStackUsername!;
      capabilities['browserstack.key'] = browserStackAccessKey!;
    },
    supportsBrowser: true,
  },
  testingbot: {
    validateOptions: ({testingBotKey, testingBotSecret}) => {
      if (!testingBotKey || !testingBotSecret) {
        throw new Error(
          'To use testingbot, you must specify TESTING_BOT_KEY and TESTING_BOT_SECRET in enviornment ' +
            'variables or provide testingBotKey and testingBotSecret as options.',
        );
      }
    },
    url: ({testingBotKey, testingBotSecret}) =>
      `http://${testingBotKey}:${testingBotSecret}@hub.testingbot.com/wd/hub`,
    supportsBrowser: true,
  },
};

export function addEnvironment({...options}: Options): Options {
  Object.keys(ENVIRONMENT_ALIASES).forEach(key => {
    if (options[ENVIRONMENT_ALIASES[key]] === undefined && process.env[key]) {
      options[ENVIRONMENT_ALIASES[key]] = process.env[key];
    }
  });

  try {
    const parsedObj = parseEnv(readFileSync('.env.local', 'utf8'));
    Object.keys(ENVIRONMENT_ALIASES).forEach(key => {
      if (options[ENVIRONMENT_ALIASES[key]] === undefined && parsedObj[key]) {
        options[ENVIRONMENT_ALIASES[key]] = parsedObj[key];
      }
    });
  } catch (e) {}

  try {
    const parsedObj = parseEnv(readFileSync('.env', 'utf8'));
    Object.keys(ENVIRONMENT_ALIASES).forEach(key => {
      if (options[ENVIRONMENT_ALIASES[key]] === undefined && parsedObj[key]) {
        options[ENVIRONMENT_ALIASES[key]] = parsedObj[key];
      }
    });
  } catch (e) {}

  return options;
}

export function resolveRemote(
  remote: string,
  {...options}: Options,
): {remote: string; remoteURI: string; options: Options} {
  let remoteURI = remote;
  const capabilities = {
    ...(options.capabilities || {}),
  };
  if (remote in REMOTE_ALIASES) {
    remote = REMOTE_ALIASES[remote];
  }
  if (remote in REMOTE_CONFIGS) {
    const remoteConfig = REMOTE_CONFIGS[remote];
    if (remoteConfig.validateOptions) {
      remoteConfig.validateOptions(options);
    }
    remoteURI = remoteConfig.url(options);
    if (remoteConfig.addCapabilities) {
      remoteConfig.addCapabilities(options, capabilities);
    }
    if (remoteConfig.supportsBrowser && options.browser) {
      Object.assign(
        capabilities,
        getBrowser(
          remote,
          options.browser.name,
          options.browser.version,
          options.browser.platform,
        ),
      );
    }
  }
  options.capabilities = capabilities;
  return {remote, remoteURI, options};
}

export default function resolveConfig(
  remote: string,
  options: Options,
): {remote: string; remoteURI: string; options: Options} {
  return resolveRemote(remote, addEnvironment(options));
}
