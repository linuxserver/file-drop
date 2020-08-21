<template>
  <div id="app">
    <notifications position="top center"/>
    <input type="file" id="upload" ref="file" @change="upload" style="display:none;" />
    <section class="file-upload">
      <h1>Upload files to IPFS</h1>
      <div class="upload" @click="$refs.file.click()" @dragover.prevent @drop="onDrop" v-if="showlinks === false" id="file">
        <font-awesome-icon class="uploadicon" icon="cloud-upload-alt" />
        <div>Drag &amp; drop your files here...</div>
        <div class="or">Or</div>
        <span class="browse">Browse Files</span>
      </div>
      <div class="uploading" v-show="showspinner === true">
        <div class="dot-fire"></div>
      </div>
      <div v-if="showlinks === true && showspinner === false">
        <div class="linkbox">
          <a :href="shorturl" target="_blank">{{ shorturl }}</a>
          <span class="pointer" @click="copyToClipboard(shorturl)"><font-awesome-icon icon="clone" /></span>
        </div>
        <div class="linkbox">
          <a :href="infuraurl" target="_blank">{{ infuraurl | truncate(25) }}</a>
          <span class="pointer" @click="copyToClipboard(infuraurl)"><font-awesome-icon icon="clone" /></span>
        </div>
        <div class="linkbox">
          <a :href="ipfsurl" target="_blank">{{ ipfsurl | truncate(25) }}</a>
          <span class="pointer" @click="copyToClipboard(ipfsurl)"><font-awesome-icon icon="clone" /></span>
        </div>
        <div class="linkbox">
          <a :href="cfurl" target="_blank">{{ cfurl | truncate(25) }}</a>
          <span class="pointer" @click="copyToClipboard(cfurl)"><font-awesome-icon icon="clone" /></span>
        </div>
        <div class="linkbox">
          <a :href="eterurl" target="_blank">{{ eterurl | truncate(25) }}</a>
          <span class="pointer" @click="copyToClipboard(eterurl)"><font-awesome-icon icon="clone" /></span>
        </div>
      </div>
      <a v-if="showlinks === true" href="" @click.prevent="reset"><font-awesome-icon icon="arrow-left" /></a>
    </section>
    <div>
      <font-awesome-icon class="footericon" :icon="['fab', 'github']" @click="githublink" />
    </div>
  </div>
</template>

<script>
import ipfsHttpClient from 'ipfs-http-client'

export default {
  name: 'App',
  data() {
    return {
      ipfs: null,
      shorturl: null,
      infuraurl: null,
      ipfsurl: null,
      cfurl: null,
      eterurl: null,
      showlinks: false,
      showspinner: false,
      dragover: false
    }
  },
  mounted: async function () {
    this.$nextTick(async function () {
      this.ipfs = await ipfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
    })
  },
  methods: {
    onDrop (e) {
      e.stopPropagation()
      e.preventDefault()
      let files = e.dataTransfer.files
      let fileInput = document.getElementById('upload')
      fileInput.files = files
      this.upload()
    },
    async upload () {
      const that = this
      that.showspinner = true
      const fileitem = document.getElementById('upload').files[0]
      if (fileitem) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(fileitem)
        reader.onload = async function(file) {
          const filebytes = file.target.result
          let ipfsreturn = await that.ipfs.add(filebytes)
          let link = 'https://ipfs.infura.io/ipfs/' + ipfsreturn.path
          let cures = await fetch('https://cu8.in/api/?action=short&urls=|' + link + '|')
          if (cures.ok) { 
            let cujson = await cures.json()
            that.shorturl = cujson.data.shortUrl.secure
            that.infuraurl = 'https://ipfs.infura.io/ipfs/' + ipfsreturn.path
            that.ipfsurl = 'https://ipfs.io/ipfs/' + ipfsreturn.path
            that.cfurl = 'https://cloudflare-ipfs.com/ipfs/' + ipfsreturn.path
            that.eterurl = 'https://ipfs.eternum.io/ipfs/' + ipfsreturn.path
            that.showspinner = false
            that.showlinks = true
          }
        }
      }
    },
    githublink () {
      window.open('https://github.com/linuxserver/file-drop')
    },
   copyToClipboard(text) {
      let input = document.createElement('textarea');
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.$notify({
        title: 'Success!',
        text: 'Copied to clipboard',
        type: 'success'
      })
    },
    reset () {
      this.shorturl = null
      this.infuraurl = null
      this.ipfsurl = null
      this.cfurl = null
      this.eterurl = null
      this.showlinks = false
    }
  }
}
</script>

<style>
a {
  color: inherit; /* blue colors for links too */
  text-decoration: inherit; /* no underline */
}
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap");
@-webkit-keyframes pulse {
  0% { box-shadow:0 0 8px #FFFFFF, inset 0 0 8px #FFFFFF; }
  50% { box-shadow:0 0 16px #FFFFFF, inset 0 0 14px #FFFFFF; }
  100% { box-shadow:0 0 8px #FFFFFF, inset 0 0 8px #FFFFFF; }
}
body {
  background:#221423;
  font-family: 'Lato', sans-serif;
  padding: 0;
  margin: 0;
  font-weight: 400;
  color: #6c5e6d;
  font-size: 14px;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.file-upload {
  background: #f1f1f1;
  padding: 20px 30px 40px;
  width: 100%;
  max-width: 420px;
  margin: 30px;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0,0,0,0.99);
  position: relative;
}
.uploading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #221423c4;
  display: flex;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 20px;
  text-transform: uppercase;
  color: #936d96;
  font-weight: 700;
}
p {
  max-width: 280px;
  margin: 0 auto 35px;
}
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.upload {
  cursor: pointer;
  background-color:transparent;
  width:100%;
  box-sizing: border-box;
  border-radius:15px;
  border: 4px dashed #936d96;
  transform: scale(1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
}
.or {
  text-transform: uppercase;
  font-weight: 700;
  color: #936d96;
  margin: 10px 0;
}
.browse {
  background: #ccc;
  padding: 10px 45px;
  text-transform: uppercase;
  color: white;
  margin-top: 10px;
}
.links {
}
.linkbox {
    display: flex;
    padding: 20px;
    text-align: left;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin: 10px 0;
}
.linkbox a {
  flex: 1;
}
.uploadicon {
  color: #ccc;
  font-size: 50px;
  margin-bottom: 8px;
}
.upload:hover > .uploadicon{
  color: #936d96;
  transition-duration: .2s;
}
.upload:hover > .browse{
  background: #936d96;
  transition-duration: .2s;
}
.upload:hover {
  transform: scale(1.05);
  transition-duration: .2s;
}
.footericon {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
  margin: 0 auto;
  color: #ccc;
  font-size: 30px;
}
.footericon:hover {
  font-size: 53px;
  transition-duration: .2s;
}
.links {
  font-family: Lato, sans-serif;
  background: white;
  border-collapse: collapse;
  width: 300px;
}
.links td, .links th {
  border: 1px solid #ddd;
  padding: 8px;
}
.pointer {
 cursor: pointer;
}
.dot-fire {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #FFFFFF;
  color: #FFFFFF;
  box-shadow: 9999px 22.5px 0 -5px #FFFFFF;
  animation: dot-fire 1.5s infinite linear;
  animation-delay: -.85s;
}
.dot-fire::before, .dot-fire::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #FFFFFF;
  color: #FFFFFF;
}
.dot-fire::before {
  box-shadow: 9999px 22.5px 0 -5px #FFFFFF;
  animation: dot-fire 1.5s infinite linear;
  animation-delay: -1.85s;
}
.dot-fire::after {
  box-shadow: 9999px 22.5px 0 -5px #FFFFFF;
  animation: dot-fire 1.5s infinite linear;
  animation-delay: -2.85s;
}
@keyframes dot-fire {
  1% { box-shadow: 9999px 22.5px 0 -5px #FFFFFF; }
  50% { box-shadow: 9999px -5.625px 0 2px #FFFFFF; }
  100% { box-shadow: 9999px -22.5px 0 -5px #FFFFFF; }
}
.vue-notification-group {
  padding-top: 50px;
}
</style>
