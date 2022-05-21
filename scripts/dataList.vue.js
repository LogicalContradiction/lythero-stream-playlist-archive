export default {
	name: "DataList",
	template: `
	<label for="filterTextEntry"> Filter: </label>
	<input type="text" id="filterTextEntry" v-model="textFilter" :placeholder="textFilterPlaceholderText">
	<button type="button" id="filterButton" @click="clearButtonHandler">Clear</button>
	<table>
		<tr>
			<th class="sortableHeader headerRow titleColumn" @click="headerLabelClickHandler('songTitle', 'songTitleTriangle')" @mouseenter="mouseEnterHeaderHandler('songTitle', 'songTitleTriangle')" @mouseleave="mouseLeaveHeaderHandler('songTitle', 'songTitleTriangle')">
				Title <div class="triangle" id="songTitleTriangle"> ▾ </div>
			</th>
			<th class="sortableHeader headerRow nameColumn" @click="headerLabelClickHandler('playerName', 'playerNameTriangle')" @mouseenter="mouseEnterHeaderHandler('playerName', 'playerNameTriangle')" @mouseleave="mouseLeaveHeaderHandler('playerName', 'playerNameTriangle')"> 
				Name in Player <div class="triangle" id="playerNameTriangle"> ▾ </div>
			</th>
			<th class="sortableHeader headerRow sourceColumn" @click="headerLabelClickHandler('sourceMedia', 'sourceMediaTriangle')" @mouseenter="mouseEnterHeaderHandler('sourceMedia', 'sourceMediaTriangle')" @mouseleave="mouseLeaveHeaderHandler('sourceMedia', 'sourceMediaTriangle')">
				Source Media <div class="triangle" id="sourceMediaTriangle"> ▾ </div>
			</th>
			<th class="sortableHeader headerRow albumColumn" @click="headerLabelClickHandler('album', 'albumTriangle')" @mouseenter="mouseEnterHeaderHandler('album', 'albumTriangle')" @mouseleave="mouseLeaveHeaderHandler('album', 'albumTriangle')">
				Album <div class="triangle" id="albumTriangle"> ▾ </div>
			</th>
			<th class="headerRow infoColumn"> Additional Info </th>
		</tr>
		<tr class="tableRow" v-for="item in displayData" :key="item.id">
			<td class="titleColumn" v-if="isValidSongLink(item.songLink)"><a :href="item.songLink" target="_blank"> {{ item.songTitle }} </a></td>
			<td class="titleColumn" v-else> {{ item.songTitle}} </td>
			<td class="nameColumn"> {{ item.playerName }} </td>
			<td class="sourceColumn"> {{ item.sourceMedia }} </td>
			<td class="albumColumn" v-if="isValidAlbumLink(item.albumPurchaseLink)"> <a :href="item.albumPurchaseLink" target="_blank"> {{ item.album }} </a></td>
			<td class="albumColumn" v-else> {{ item.album }} </td>
			<td class="infoColumn">
				<div v-if="isValidDBLink(item.albumDatabaseLink)"> <a :href="item.albumDatabaseLink" target="_blank"> Album Info </a> </div>
				<div v-if="isNotesJustLink(item.notes)" v-html="item.notes"> </div>
				<div v-else-if="isValidNotes(item.notes)">
					<div class="notesHider" :id="'notesText'+ item.id" @click="notesClickHandler(item.id)"> Click to show notes ▸ </div>
					<div class="hidden" :id="'hidden' + item.id" v-html="item.notes"> </div>
				</div>
			</td>
		</tr>
	</table>
	<button type="button" @click="incrementPageNum"> Increment pagenum </button>
	<button type="button" @click="decrementPageNum"> Decrement pagenum </button>
	<button type="button" @click="changeNumEntriesPerPage(50)"> Change number entries per page </button>
	<button type="button" @click="showTextFilter"> show text filter </button>
	`,
	data(){
		return {
			textFilter: "",
			textFilterPlaceholderText: "Song Title or Name in Player",

			currentDataView: this.trackList,

			ascending: true,
			currentSortColumn: 'songTitle',

			currentPageNum: 1,
			numEntriesPerPage: 25,
			maxNumPages: Math.ceil(this.trackList.length / 25),

		};
	},
	computed: {
		filteredData(){
			console.log("filteredData called");
			if(this.textFilter == ""){
				return this.getPageOfData();
			}
			return this.basicFiltering();
		},
		displayData(){
			console.log("displayData called");
			return this.getPageOfData()
		}

	},
	methods: {
		basicFiltering(){
			console.log("basicFiltering called");
			if(this.textFilter !== ""){
				let searchText = this.textFilter.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
				this.currentDataView = this.trackList.filter((element) => (element.songTitle.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1) || (element.playerName.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1))
			}
			return
		},
		clearButtonHandler(){
			console.log("clearButtonHandler called");
			this.textFilter = "";
			document.getElementById("filterTextEntry").focus();
		},
		isValidSongLink(link){
			return link != "N/A";
		},
		isValidAlbumLink(link){
			return link != "";
		},
		isValidDBLink(link){
			return link != "";
		},
		isValidNotes(notes){
			return notes != "";
		},
		notesHasLink(notes){
			if("abcd".includes("a")){
				//test to see if browser supports string.includes (IE does not)
				if(notes.includes("<a href=")){
					return true;
				}
				return false;
			}
			if(notes.indexOf("<a href=") === -1){
				//fallback incase it is not supported
				return false;
			}
			return true;
		},
		isNotesJustLink(notes){
			return notes.indexOf("<a ") === 0 && notes.indexOf("</a>") === notes.length-4;
		},
		notesClickHandler(rowNum){
			let notesID = "hidden" + rowNum;
			let currentDisplay = getComputedStyle(document.getElementById(notesID)).display;
			if(currentDisplay === "none") {
				document.getElementById(notesID).style.display = "block";
				document.getElementById("notesText" + rowNum).textContent = "Click to hide notes ◂";
			}
			else{
				document.getElementById(notesID).style.display = "none";
				document.getElementById("notesText" + rowNum).textContent = "Click to show notes ▸"
			}
		},
		mouseEnterHeaderHandler(column, triangleID){
			if(this.currentSortColumn != column){
				//not sorting by this column, so just show the arrow
				document.getElementById(triangleID).style.visibility = "visible";
			}
			else{
				//currently sorting by this column, so it's already visible
				if(this.ascending){
					//show descending arrow
					document.getElementById(triangleID).innerText = "▴";
				}
				else{
					//show ascending arrow
					document.getElementById(triangleID).innerText = "▾"
				}
			}
		},
		mouseLeaveHeaderHandler(column, triangleID){
			if(this.currentSortColumn != column){
				//not sorting by this column, so just hide the arrow
				document.getElementById(triangleID).style.visibility = "hidden";
			}
			else{
				//sorting by this column, so it's already visible
				if(this.ascending){
					//show ascending arrow
					document.getElementById(triangleID).innerText = "▾";
				}
				else{
					//show descending arrow
					document.getElementById(triangleID).innerText = "▴"
				}
			}
		},
		headerLabelChange(column, triangleID){
			if(this.currentSortColumn == column){
				//this is the same column
				if(this.ascending){
					//ascending
					document.getElementById(triangleID).innerText = "▾";
				}
				else{
					//descending
					document.getElementById(triangleID).innerText = "▴"
				}
			}
			else{
				//different column
				let oldsortTriangle = this.currentSortColumn + "Triangle";
				//make the old triangle down
				document.getElementById(oldsortTriangle).innerText = "▾";
				//now hide it
				document.getElementById(oldsortTriangle).style.visibility = "hidden";
				//now unhide the new one
				document.getElementById(triangleID).style.visibility = "visible";
			}
		},
		headerLabelClickHandler(column, triangleID){
			if(this.currentSortColumn == column){
				//clicked on same column, so invert ascending
				this.ascending = !this.ascending;
			}
			else{
				//clicked on different column, set ascending to true
				this.ascending = true;
			}
			//update the labels
			this.headerLabelChange(column, triangleID);
			//update the sortByColumn
			if(this.currentSortColumn != column){
				this.currentSortColumn = column;
			}
			//reset page number
			this.currentPageNum = 1;
			//do sorting here
			let collator = new Intl.Collator("en", {sensitivity: "base"});
			if(this.ascending){
				return this.currentDataView.sort((first, second) =>collator.compare(first[column], second[column]));
			}
			else{
				//collator returns positive if first is first, negavite if second is first, and 0 if equal. Negate the result to invert
				return this.currentDataView.sort((first, second) => -1*collator.compare(first[column], second[column]));
			}
		},
		getPageOfData(){
			console.log("getPageOfData called");
			let startIndex = (this.currentPageNum - 1) * this.numEntriesPerPage;
			let endIndex = this.currentPageNum * this.numEntriesPerPage;

			return this.currentDataView.slice(startIndex, endIndex);
		},
		incrementPageNum(){
			console.log("incrementPageNum called");
			if(!(this.currentPageNum+1 > this.maxNumPages)){
				this.currentPageNum++;
			}
			console.log("pageNum:", this.currentPageNum);
		},
		decrementPageNum(){
			console.log("decrementPageNum called");
			if(!(this.currentPageNum-1 <= 0)){
				this.currentPageNum--;
			}
			console.log("pageNum:", this.currentPageNum);
		},
		changeNumEntriesPerPage(newNumEntries){
			console.log("num entries change called")
			this.numEntriesPerPage = newNumEntries;
		},
		showTextFilter(){
			console.log("text filter:", this.textFilter);
		},
		setMaxNumPages(){
			console.log("setMaxNumPages called");
			this.maxNumPages = Math.ceil(this.currentDataView.length / this.numEntriesPerPage);
			console.log("maxNumPages:", this.maxNumPages);
		}

	},
	watch: {
		textFilter(){
			console.log("change in textFilter");
			this.currentPageNum = 1;
			if(this.textFilter !== ""){
				let searchText = this.textFilter.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
				this.currentDataView = this.trackList.filter((element) => (element.songTitle.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1) || (element.playerName.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1))
			}
			else{
				this.currentDataView = this.trackList
			}
		},
		currentDataView(){
			this.setMaxNumPages();
		},
		numEntriesPerPage(){
			this.setMaxNumPages();
		}

	},
	props: {
		trackList: Array
	}
}