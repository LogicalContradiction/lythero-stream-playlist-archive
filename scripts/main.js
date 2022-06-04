import DataList from "./dataList.vue.js"
import TrackData from "./trackData.js"

export default {
	name : 'app',
	components: {
		DataList
	},
	data() {
		return {
			trackData: TrackData
		}
	},
	template:`
	<p>This is a fan-made website dedicated to keeping track of the songs in Lythero's stream music playlist.</p>
	<br>
	<p> 
		<a href="https://www.youtube.com/" target="_blank">YouTube playlist that contains most of the songs in this list.</a>
	</p>
	<p>
		<a href="https://www.youtube.com/playlist?list=PLQFIg1qsgNezAe6-3NgtfTRZlaQXo46LX" target="_blank">Another YouTube playlist for Lythero music</a> (this webpage and list are separate from this playlist).
	</p>

	<DataList :trackList="trackData"></DataList>
	`,
	methods(){

	},
	computed(){

	}
}