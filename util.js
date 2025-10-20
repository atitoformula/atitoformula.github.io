function analytics(eventn,params) {
    try {
        if(params === undefined) {
            ym(98874513, "params", { [eventn] : "" })
        } else {
            const p = JSON.parse(params)
            //console.log(p)
            ym(98874513, "params", { [eventn] : p })
        }
    } catch(error) {
        console.error(error)
        try {
           ym(98874513, "params", { "metr_error" : eventn.replace(/[^\x00-\x7F]/g, '').substring(0, 15) })
        } catch(error) {
            console.error(error)
        }
    }
}

//function setNativeResolution() {
//    var width = document.documentElement.clientWidth * window.devicePixelRatio;
//    viewport = document.querySelector("meta[name=viewport]");
//    viewport.setAttribute('content', 'user-scalable=0,width=device-width,height=device-height,initial-scale=' + 1/window.devicePixelRatio);
//    document.documentElement.style.transform = `scale(${1 / window.devicePixelRatio})`;
//    document.documentElement.style.transformOrigin = 'top left';
//}

 function startUpload(onUploadedFile) {
    const uploadEl = document.getElementById('fileupload')
    const listener = (event) => {
        uploadEl.removeEventListener('change', listener);
        handleFileSelect(event, onUploadedFile)
    }
    uploadEl.addEventListener('change',listener,false);
    document.getElementById('fileupload').click();
}

function handleFileSelect(event, onUploadedFile) {
    const reader = new FileReader()
    reader.onload = (event) =>  {
        console.log(event);
        onUploadedFile(event.target.result)
        document.getElementById('fileupload').value = ''
     };
    reader.readAsArrayBuffer(event.target.files[0])
}

 const download = (text, filename) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const openImage = (base64, filename) => {
    const url = 'data:image/png;base64,' + encodeURIComponent(base64)
    var win = window.open();
    win.document.title = "Exported formulas image"
    win.document.body.innerHTML = `
        <body>
            <image src="${url}" style="max-width: 100%; max-height: 100%"></image>
        </body>
    `;
}

const generateIv = () => {
      return new Uint8Array([2,3,4,6,7,2,4,6,8,5,2,12])
    }

const generateKey = async () => {
  return window.crypto.subtle.generateKey({
    name: 'AES-GCM',
    length: 256,
  }, true, ['encrypt', 'decrypt'])
}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

const fetchDnl = async () => {
    const r = await fetch("idata-orig")
    const t = await r.text()
    const encoder = new TextEncoder()
    const data = encoder.encode(t)
    const key = await generateKey()
    const kr = await window.crypto.subtle.exportKey("raw", key)
    console.log(kr)
    const iv = generateIv()
    const d2 = await window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: iv,
      }, key, data)
    console.log(d2)

    const t2 = _arrayBufferToBase64(d2)
    download(t2, "idata2")
}

const readi = async (keyi) => {
    try {
        const keyr = new Int32Array(keyi).buffer
        const data = await (await fetch("idata")).arrayBuffer()
        const iv = generateIv()
        const key = await window.crypto.subtle.importKey("raw", keyr, 'AES-GCM', true, ['encrypt', 'decrypt'])
        const data2 = await window.crypto.subtle.decrypt({name: 'AES-GCM',iv: iv}, key, data)
        var decoder = new TextDecoder('utf8');
        return decoder.decode(data2);
    } catch(error) {
        console.error(error)
        return ""
    }
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

function copyImage(bytes) {
    try {
        navigator.clipboard.write([
            new ClipboardItem({
                'image/png': new Blob([bytes], {type: 'image/png'})
            })
        ]);
    } catch (error) {
        console.error(error);
    }
}

async function pasteImage() {
  try {
    const clipboardItems = await navigator.clipboard.read();

    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        console.log(type)
        if(type.startsWith("image")) {
            const blob = await clipboardItem.getType(type);
            return blob
        }
      }
      return Promise.resolve(null)
    }
  } catch (err) {
     console.error(err.name, err.message);
  }
}