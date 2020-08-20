<template>
  <div id="app">
    <button @click="$refs.file.click()" class="btn" id="file">{{ filebutton }}</button>
    <input type="file" id="upload" ref="file" @change="filebuttonchange" style="display:none;" />
    <button @click="upload" class="btn">Upload</button>
    <div>Short URL: <a :href="shorturl" target="_blank">{{ shorturl }}</a></div>
    <div>Infura: <a :href="infuraurl" target="_blank">{{ infuraurl }}</a></div>
    <div>Ipfs.io: <a :href="ipfsurl" target="_blank">{{ ipfsurl }}</a></div>
    <div>Cloudflare: <a :href="cfurl" target="_blank">{{ cfurl }}</a></div>
    <div>Eternum: <a :href="eterurl" target="_blank">{{ eterurl }}</a></div>
  </div>
</template>

<script>
import ipfsHttpClient from 'ipfs-http-client'

export default {
  name: 'App',
  data() {
    return {
      ipfs: null,
      filebutton: 'Select File',
      shorturl: null,
      infuraurl: null,
      ipfsurl: null,
      cfurl: null,
      eterurl: null
    }
  },
  mounted: async function () {
    this.$nextTick(async function () {
      this.ipfs = await ipfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
    })
  },
  methods: {
    filebuttonchange () {
      const fileitem = document.getElementById('upload').files[0]
      this.filebutton = fileitem.name.substring(0, 10) + '..'
    },
    async upload () {
      const that = this
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
          }
        }
      }
    }
  }
}
</script>

<style>
</style>
