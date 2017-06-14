import React, {Component} from 'react';
import styled from 'styled-components';
import getBrowser, {getDefaultVersionNumber, getDefaultOS, browsers} from 'available-browsers';
import CodeBlock from './documentation/code-block';
import ImportDeclaration from './documentation/import-declaration';
import Keyword from './documentation/keyword';
import String from './documentation/string';

const Select = styled.select`
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: hsl(0, 0%, 33%);
  background-color: hsl(0, 0%, 100%);
  background-image: none;
  border: 1px solid hsl(0, 0%, 80%);
  border-radius: 4px;
  margin: 16px 0;
  font-family: inherit;
  max-width: 30em;
`;

function sortVersions(versions) {
  return versions.sort((a, b) => {
    if (/^[0-9\.]+$/.test(a) && /^[0-9\.]+$/.test(b)) {
      return +b - (+a);
    }
    return a < b ? 1 : -1;
  });
}
function Indent() {
  return <span><span>{' '}</span><span>{' '}</span></span>;
}

class Browsers extends Component {
  state = {
    remote: 'DEFAULT',
    browserName: 'DEFAULT',
    version: 'DEFAULT',
    platform: 'DEFAULT',
  };
  _getBrowserName() {
    if (this.state.remote === 'DEFAULT') return 'DEFAULT';
    if (!browsers[this.state.remote][this.state.browserName]) return 'DEFAULT';
    return this.state.browserName;
  }
  _getSelectedVersion() {
    const browserName = this._getBrowserName();
    if (browserName === 'DEFAULT') return 'DEFAULT';
    if (!browsers[this.state.remote][browserName][this.state.version]) return 'DEFAULT';
    return this.state.version;
  }
  _getVersion() {
    const browser = this._getBrowserName();
    const version = this._getSelectedVersion();
    if (browser !== 'DEFAULT' && version === 'DEFAULT') {
      return getDefaultVersionNumber(browser, this.state.remote);
    }
    return version;
  }

  _getSelectedPlatform() {
    const browserName = this._getBrowserName();
    const version = this._getVersion();
    if (browserName === 'DEFAULT') return 'DEFAULT';
    if (!browsers[this.state.remote][browserName][version][this.state.platform]) return 'DEFAULT';
    return this.state.platform;
  }
  _getPlatform() {
    const browser = this._getBrowserName();
    const version = this._getVersion();
    const platform = this._getSelectedPlatform();
    if (browser !== 'DEFAULT' && platform === 'DEFAULT') {
      return getDefaultOS(browser, version, this.state.remote);
    }
    return platform;
  }

  _onChangeRemote = e => {
    this.setState({remote: e.target.value});
  };
  _onChangeBrowserName = e => {
    this.setState({browserName: e.target.value});
  };
  _onChangeVersion = e => {
    this.setState({version: e.target.value});
  };
  _onChangePlatform = e => {
    this.setState({platform: e.target.value});
  };
  render() {
    const {remote} = this.state;
    return (
      <div>
        <p>
          Cabbie lets you pass in a <code>browser</code> option to select a browser and version.
          You can generate setup examples for every available browser here.
          N.B. you can provide the same "browser" option to get the same browser for any remote provider.
        </p>
        <Select value={remote} onChange={this._onChangeRemote}>
          <option value="DEFAULT">Select a remote provider</option>
          <option value="browserstack">Browser Stack</option>
          <option value="saucelabs">Sauce Labs</option>
          <option value="testingbot">Testing Bot</option>
        </Select>
        {this._renderWithRemote()}
      </div>
    );
  }
  _renderWithRemote() {
    const {remote} = this.state;
    if (remote === 'DEFAULT') {
      return null;
    }
    return (
      <div>
        <Select value={this._getBrowserName()} onChange={this._onChangeBrowserName}>
          <option value="DEFAULT">Select a browser</option>
          {Object.keys(browsers[remote])
            .map(browserName => <option key={browserName} value={browserName}>{browserName}</option>)}
        </Select>
        {this._renderWithBrowser()}
      </div>
    );
  }
  _renderWithBrowser() {
    const {remote} = this.state;
    const browserName = this._getBrowserName();
    if (browserName === 'DEFAULT') {
      return null;
    }
    const selectedVersion = this._getSelectedVersion();
    const version = this._getVersion();
    const defaultVersion = getDefaultVersionNumber(browserName, this.state.remote);

    const selectedPlatform = this._getSelectedPlatform();
    const platform = this._getPlatform();
    const defaultPlatform = getDefaultOS(browserName, version, remote);

    const useDefaultVersion = selectedVersion === 'DEFAULT' && selectedPlatform === 'DEFAULT';

    const capabilities = getBrowser(remote, browserName, version, platform);

    return (
      <div>
        <Select value={selectedVersion} onChange={this._onChangeVersion}>
          <option value="DEFAULT">Default Version ({defaultVersion})</option>
          {sortVersions(Object.keys(browsers[remote][browserName])).map(version => (
            <option key={version} value={version}>{version}</option>
          ))}
        </Select>
        <Select value={selectedPlatform} onChange={this._onChangePlatform}>
          <option value="DEFAULT">Default Platform ({defaultPlatform})</option>
          {Object.keys(browsers[remote][browserName][version])
            .map(platform => <option key={platform} value={platform}>{platform}</option>)}
        </Select>
        <CodeBlock>
          <ImportDeclaration exportKey="default" local="cabbie" />
          <br /><br />
          <Keyword>const</Keyword> driver = cabbie(<String>'{remote}'</String>, {'{'}<br />
          <Indent />browser: {'{'}<br />
          <Indent /><Indent />name: <String>'{browserName}'</String>{useDefaultVersion ? '' : ','}<br />
          {useDefaultVersion
            ? null
            : <span>
                <Indent />
                <Indent />
                version:{' '}
                <String>'{version}'</String>
                {selectedPlatform === 'DEFAULT' ? '' : ','}
                <br />
              </span>}
          {selectedPlatform === 'DEFAULT'
            ? null
            : <span><Indent /><Indent />platform: <String>'{platform}'</String><br /></span>}
          <Indent />{'}'}<br />
          {'}'});
        </CodeBlock>
        <p>This consistent set of options is equivalent to passing in capabilities of:</p>
        <CodeBlock>
          {'{'}
          {Object.keys(capabilities).map((key, i, list) => (
            <div key={key}>
              <Indent />'{key}': <String>'{capabilities[key]}'</String>{i < list.length - 1 ? ',' : ''}
            </div>
          ))}
          {'}'}
        </CodeBlock>
      </div>
    );
  }
}

export default Browsers;
