//Нужно скопировать в консоль браузера, для проверки 

// sudo service coturn restart
//  netstat -npta
//  sudo service kurento-media-server start

function checkTURNServer(turnConfig, timeout){ 

    return new Promise(function(resolve, reject){
  
      setTimeout(function(){
          if(promiseResolved) return;
          resolve(false);
          promiseResolved = true;
      }, timeout || 5000);
  
      var promiseResolved = false
        , myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection  
        , pc = new myPeerConnection({iceServers:[turnConfig]})
        , noop = function(){}; window['ttt']=pc;window['tt']=myPeerConnection;
      pc.createDataChannel("");   
      pc.createOffer(function(sdp){
        if(sdp.sdp.indexOf('typ relay') > -1){
          promiseResolved = true;
          resolve(true);
        }
        pc.setLocalDescription(sdp, noop, noop);
      }, noop);   
      pc.onicecandidate = function(ice){  
        if(promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1))  return;
        promiseResolved = true;
        resolve(true);
      };
    });   
  }
  
  const USERNAME="anticafeturnuser"
  const PASSWORD="501c59d8d525a6a6f2042dbcc638c927"
  const PORT=80
  const IP="turn.anticafeturn.ru" 
  
  console.log('TURN server reachable on TCP?', await checkTURNServer( {
      url: `turn:${IP}:${PORT}?transport=tcp`,
      username: USERNAME,
      credential: PASSWORD,
  }))
  
  console.log('TURN server reachable on UDP?', await checkTURNServer( {
      url: `turn:${IP}:${PORT}?transport=udp`,
      username: USERNAME,
      credential: PASSWORD,
  }))