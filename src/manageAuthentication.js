import { config } from "./config.js";
import { applicationURLs, refreshToken } from "./shared.js";

export const checkAccessTokenValidity = async () => {
  const access_token = JSON.parse(localStorage.parms).access_token;
  try {
    const response = await fetch("https://api.box.com/2.0/users/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    if (response.status === 401) {
      if ((await refreshToken()) === true)
        return await checkAccessTokenValidity();
    }
    if (response.status === 200) {
      return response.json();
    } else {
      return null;
    }
  } catch (error) {
    if ((await refreshToken()) === true)
      return await checkAccessTokenValidity();
  }
};

// export const loginMail = () => {
//   location.href = `https://login.microsoftonline.com/14b77578-9773-42d5-8507-251ca2dc2b06/oauth2/v2.0/authorize?response_type=code&client_id=f0555410-abd7-4fc6-8487-5cbfedd2bac4&redirect_uri=http://localhost&state=T2j8Q~tLwYx1SDlViJ7J6BLvIkaLEK9ifV25wc-o&scope=User.Read`;
// }

export const loginObs = () => {
  sessionStorage.setItem("page", "bcrp");
  location.href = `https://account.box.com/api/oauth2/authorize?response_type=code&client_id=${config.iniAppStage.client_id}&redirect_uri=${applicationURLs.stage}&state=${config.iniAppStage.stateIni}`;
};

export const loginAppDev = () => {
  sessionStorage.setItem("page", "bcrp");
  location.href = `https://account.box.com/api/oauth2/authorize?response_type=code&client_id=${config.iniAppLocal.client_id}&redirect_uri=${location.href}&state=${config.iniAppLocal.stateIni}`;
};

export const loginAppEpisphere = () => {
  sessionStorage.setItem("page", "bcrp");
  location.href = `https://account.box.com/api/oauth2/authorize?response_type=code&client_id=${config.iniAppDev.client_id}&redirect_uri=${location.origin + location.pathname}&state=${config.iniAppDev.stateIni}`;
};

export const loginAppProd = () => {
  sessionStorage.setItem("page", "bcrp");
  location.href = `https://account.box.com/api/oauth2/authorize?response_type=code&client_id=${config.iniAppProd.client_id}&redirect_uri=${applicationURLs.prod}&state=${config.iniAppProd.stateIni}`;
};

export const logOut = async () => {
  if (!localStorage.parms) return;
  const access_token = JSON.parse(localStorage.parms).access_token;
  let clt = {};
  //let urltest = location.origin + location.pathname;
  if (location.origin.indexOf("localhost") !== -1){ 
      clt = config.iniAppLocal;
    } else if (location.origin.indexOf("episphere") !== -1){ 
      clt = config.iniAppDev;
    } else if (location.origin.indexOf("epidataplatforms-stage") !== -1){
      clt = config.iniAppStage;
    } else if (location.origin.indexOf("epidataplatforms") !== -1){
      clt = config.iniAppProd;
      console.log(clt);
    }
  const response = await fetch(`https://api.box.com/oauth2/revoke`, {
    method: "POST",
    mode: "no-cors",
    body: `token=${access_token}&client_id=${clt.client_id}&client_secret=${clt.server_id}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  console.log(response);
  //delete localStorage.parms;
  //location.reload();
};
