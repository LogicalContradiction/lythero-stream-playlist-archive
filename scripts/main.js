import DataList from "./dataList.vue.js"
import Footer from "./footer.vue.js"
import TrackData from "./trackData.js"

export default {
	name : 'app',
	components: {
		DataList,
		Footer
	},
	data() {
		return {
			trackData: TrackData
		}
	},
	template:`

	<DataList :trackList="trackData"></DataList>

	<Footer></Footer>
	`,
	methods(){

	},
	computed(){

	}
}