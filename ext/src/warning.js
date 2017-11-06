$("#container").prepend(`
  <style>#breach p { margin: 10px }; #breach { padding-top: 30px; padding-bottom: 30px; }</style>
  <div id='breach' style='background-color: red; color: white'>
    <h1>Oracle Security Advisory</h1>
    <p>This Chrome extension has been compromised from October 3rd 2017 to November 6th (until this update), with a malicious update pushed out onto the Chrome Web Store. The last authorized update was in June 4th.</p>
    <p>The compromised extension logged usernames and passwords on epicmafia.net. There is no evidence that the extension had access to passwords on other sites.</p>
    <p>The Oracle extension should no longer be compromised, but as it is unknown how the extension (and analytics server) were compromised in the first place, you should <strong>IMMEDIATELY UNINSTALL THIS EXTENSION AND CHANGE YOUR PASSWORDS</strong>. No further updates to this extension will be (legitimately) made.</p>
    <p>The server to which the compromised extension has been logging into was accessed by the following IP: "Last login: Sun Nov  5 11:18:54 2017 from 196.52.84.60". This server has been taken offline for further investigation.</p>
    <p>If you have any information, please file <a href="https://github.com/lailaiem/oracle/issues">file an issue</a> at the GitHub.</p>
    <p>Because charley has suspended by account on EM as she mistakenly believes it is me (lol, if it was me, there would be no way it'd be detected nor traced to me), you should not expect further communication on epicmafia.com.</p>
    <p>Again, UNINSTALL THIS EXTENSION and CHANGE YOUR PASSWORDS.</p>
  </div>
`);
