export function setToken(cname, token, exhours) {
  let dd = new Date();
  dd.setHours(dd.getHours() + exhours);
  dd = dd.toGMTString();
  const host = window.location.host.split('.')[1] + '.' + window.location.host.split('.')[2];
  if (host === 'jdd-hub.com') {
    document.cookie = `${cname}=${token};expires=${dd};path=/;domain=.jdd-hub.com`;
  } else {
    document.cookie = `${cname}=${token};expires=${dd};path=/`;
  }
}

export function getToken(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function removeToken(cname) {
  setToken(cname, "", -1);
}