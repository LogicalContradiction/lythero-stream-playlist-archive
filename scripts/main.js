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
	<p></p>

	<DataList :trackList="trackData"></DataList>
	`,
	methods(){

	},
	computed(){

	}
}