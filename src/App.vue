<template>
  <div id="app">
    <notifications position="top center"/>
    <input type="file" id="upload" ref="file" @change="upload" style="display:none;" />
    <div class="upload center" @click="$refs.file.click()" @dragover.prevent @drop="onDrop" id="file" v-if="showlinks == false && showspinner == false">
      <font-awesome-icon class="uploadicon center" icon="upload" />
    </div>
    <table class="center links" v-if="showlinks == true && showspinner == false">
      <tr>
        <td><a :href="shorturl" target="_blank">{{ shorturl }}</a></td>
        <td class="pointer" @click="copyToClipboard(shorturl)"><font-awesome-icon icon="clone" /></td>
      </tr>
      <tr>
        <td><a :href="infuraurl" target="_blank">{{ infuraurl | truncate(25) }}</a></td>
        <td class="pointer" @click="copyToClipboard(infuraurl)"><font-awesome-icon icon="clone" /></td>
      </tr>
      <tr>
        <td><a :href="ipfsurl" target="_blank">{{ ipfsurl | truncate(25) }}</a></td>
        <td class="pointer" @click="copyToClipboard(ipfsurl)"><font-awesome-icon icon="clone" /></td>
      </tr>
      <tr>
        <td><a :href="cfurl" target="_blank">{{ cfurl | truncate(25) }}</a></td>
        <td class="pointer" @click="copyToClipboard(cfurl)"><font-awesome-icon icon="clone" /></td>
      </tr>
      <tr>
        <td><a :href="eterurl" target="_blank">{{ eterurl | truncate(25) }}</a></td>
        <td class="pointer" @click="copyToClipboard(eterurl)"><font-awesome-icon icon="clone" /></td>
      </tr>
    </table>
    <div v-if="showlinks == true && showspinner == false">
      <font-awesome-icon class="footericon" icon="arrow-left" @click="reset" />
    </div>
    <div class="center" v-show="showspinner == true">
      <div class="dot-fire"></div>
    </div>
    <div v-if="showlinks == false && showspinner == false">
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
@import url("https://fonts.googleapis.com/css?family=Lato:300");
@-webkit-keyframes pulse {
  0% { box-shadow:0 0 8px #FFFFFF, inset 0 0 8px #FFFFFF; }
  50% { box-shadow:0 0 16px #FFFFFF, inset 0 0 14px #FFFFFF; }
  100% { box-shadow:0 0 8px #FFFFFF, inset 0 0 8px #FFFFFF; }
}
body {
  background:#1f1f1f;
  width:300px;
  margin:60px auto;
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
  width:300px;
  height:300px;
  border-radius:150px;
  box-shadow: 0 0 8px #FFFFFF, inset 0 0 8px #FFFFFF;
  -webkit-animation: pulse 2s linear 1s infinite;
}
.uploadicon {
  color: white;
  font-size: 125px;
  filter:drop-shadow(3.5px 3.5px 1px #606060);
}
.upload:hover > .uploadicon{
  color: #D3D3D3;
  font-size: 127px;
  transition-duration: .2s;
}
.upload:hover {
  width:310px;
  height:310px;
  border-radius:155px;
  transition-duration: .2s;
}
.footericon {
  cursor: pointer;
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  color: white;
  font-size: 50px;
  filter:drop-shadow(3.5px 3.5px 1px #606060);
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
