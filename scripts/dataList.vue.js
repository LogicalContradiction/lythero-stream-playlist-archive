export default {
	name: "DataList",
	template: `
	<label for="filterTextEntry"> Filter: </label>
	<input type="text" id="filterTextEntry" v-model="textFilter" :placeholder="textFilterPlaceholderText">
	<button type="button" @click="clearButtonHandler">Clear</button>
	<table>
		<tr>
			<th class="sortableHeader" @click="headerLabelClickHandler('songTitle', 'songTitleTriangle')" @mouseenter="mouseEnterHeaderHandler('songTitle', 'songTitleTriangle')" @mouseleave="mouseLeaveHeaderHandler('songTitle', 'songTitleTriangle')">
				Title <div class="triangle" id="songTitleTriangle"> ▾ </div>
			</th>
			<th class="sortableHeader" @click="headerLabelClickHandler('playerName', 'playerNameTriangle')" @mouseenter="mouseEnterHeaderHandler('playerName', 'playerNameTriangle')" @mouseleave="mouseLeaveHeaderHandler('playerName', 'playerNameTriangle')"> 
				Name in Player <div class="triangle" id="playerNameTriangle"> ▾ </div>
			</th>
			<th class="sortableHeader" @click="headerLabelClickHandler('sourceMedia', 'sourceMediaTriangle')" @mouseenter="mouseEnterHeaderHandler('sourceMedia', 'sourceMediaTriangle')" @mouseleave="mouseLeaveHeaderHandler('sourceMedia', 'sourceMediaTriangle')">
				Source Media <div class="triangle" id="sourceMediaTriangle"> ▾ </div>
			</th>
			<th class="sortableHeader" @click="headerLabelClickHandler('album', 'albumTriangle')" @mouseenter="mouseEnterHeaderHandler('album', 'albumTriangle')" @mouseleave="mouseLeaveHeaderHandler('album', 'albumTriangle')">
				Album <div class="triangle" id="albumTriangle"> ▾ </div>
			</th>
			<th> Additional Info </th>
		</tr>
		<tr>
			<td>
				<div id="notesText0" @click="notesClick(0)"> Click to show notes▸ </div>
				<div class="hidden" id="hidden0"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate hendrerit nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec arcu massa, aliquam auctor iaculis vel, eleifend non erat. Vivamus a mi sed tortor elementum tincidunt. Curabitur finibus finibus ornare. Mauris bibendum ut nulla pretium viverra. Suspendisse tempor at risus quis rutrum. Nam auctor lorem condimentum ipsum consequat finibus. Proin sit amet lacus id arcu accumsan ultricies posuere ut lacus. Etiam lobortis, nisi a hendrerit ultrices, leo lorem maximus lacus, in molestie ex ante et tellus. Phasellus ultricies in est facilisis tristique. Nam venenatis metus nisl, congue malesuada nisi elementum nec. Phasellus dapibus libero et elit ultricies bibendum. Ut volutpat magna quis nunc sagittis placerat. Aliquam mattis ex vitae ultrices ultrices. </div>
			</td>
			<td class="sortableHeader" @click="headerLabelClickHandler('songTitle', 'songTitleTriangle')" @mouseenter="mouseEnterHeaderHandler('songTitle', 'songTitleTriangle')" @mouseleave="mouseLeaveHeaderHandler('songTitle', 'songTitleTriangle')"> Title <div class="triangle" id="songTitleTriangl"> ▾ </div>
			</td>
			<td class="sortableHeader" @click="headerLabelClickHandler('playerName', 'playerNameTriangle')" @mouseenter="mouseEnterHeaderHandler('playerName', 'playerNameTriangle')" @mouseleave="mouseLeaveHeaderHandler('playerName', 'playerNameTriangle')"> Name in Player <div class="triangle" id="playerNameTriangle"> ▾ </div>
			</td>

		</tr>
		<tr v-for="item in filteredData" :key="item.id">
			<td v-if="isValidSongLink(item.songLink)"> <a :href="item.songLink" target="_blank"> {{ item.songTitle }} </a></td>
			<td v-else> {{ item.songTitle}} </td>
			<td> {{ item.playerName }} </td>
			<td> {{ item.sourceMedia }} </td>
			<td v-if="isValidAlbumLink(item.albumPurchaseLink)"> <a :href="item.albumPurchaseLink" target="_blank"> {{ item.album }} </a></td>
			<td v-else> {{ item.album }} </td>
			<td>
				<div v-if="isValidDBLink(item.albumDatabaseLink)"> <a :href="item.albumDatabaseLink" target="_blank"> Album Info </a> </div>
				<div v-if="notesHasLink(item.notes)" v-html="item.notes"> </div>
				<div v-else-if="isValidNotes(item.notes)" :title="item.notes"> Notes (hover to view) </div>
			</td>
		</tr>
	</table>
	`,
	data(){
		return {
			textFilter: "",
			textFilterPlaceholderText: "Song Title or Name in Player",

			ascending: true,
			currentSortColumn: 'songTitle',

		};
	},
	computed: {
		filteredData(){
			if(this.textFilter == ""){
				return this.trackList
			}
			return this.basicFiltering(this.textFilter)
		}

	},
	methods: {
		basicFiltering(text){
			let searchText = text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
			console.log("searchtext=",searchText)
			return this.trackList.filter((element) => (element.songTitle.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1) || (element.playerName.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1))
		},
		clearButtonHandler(){
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
			console.log("notes:", notes)
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
		notesClick(rowNum){
			let notesID = "hidden" + rowNum;
			console.log("before display:", getComputedStyle(document.getElementById(notesID)).display);
			let currentDisplay = getComputedStyle(document.getElementById(notesID)).display;
			if(currentDisplay === "none") {
				document.getElementById(notesID).style.display = "block";
				document.getElementById("notesText" + rowNum).textContent = "Click to hide notes◂";
			}
			else{
				document.getElementById(notesID).style.display = "none";
				document.getElementById("notesText" + rowNum).textContent = "Click to show notes▸"
			}
			console.log("after display:", getComputedStyle(document.getElementById(notesID)).display);
		},
		mouseEnterHeaderHandler(column, triangleID){
			console.log("test enter called")
			if(this.currentSortColumn != column){
				console.log("sorting by different")
				//not sorting by this column, so just show the arrow
				document.getElementById(triangleID).style.visibility = "visible";
			}
			else{
				console.log("sorting by same")
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
			console.log("test exit called")
			if(this.currentSortColumn != column){
				console.log("sorting by different")
				//not sorting by this column, so just hide the arrow
				document.getElementById(triangleID).style.visibility = "hidden";
			}
			else{
				console.log("sorting by same")
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
		headerLabelChangeTest(column, triangleID){
			console.log("test label change called")
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
			console.log("test header label click called")
			if(this.currentSortColumn == column){
				//clicked on same column, so invert ascending
				this.ascending = !this.ascending;
			}
			else{
				//clicked on different column, set ascending to true
				this.ascending = true;
			}
			//update the labels
			this.headerLabelChangeTest(column, triangleID);
			//update the sortByColumn
			if(this.currentSortColumn != column){
				this.currentSortColumn = column;
			}
			//do sorting here
			let collator = new Intl.Collator("en", {sensitivity: "base"});
			if(this.ascending){
				return this.trackList.sort((first, second) =>collator.compare(first[column], second[column]));
			}
			else{
				//collator returns positive if first is first, negavite if second is first, and 0 if equal. Negate the result to invert
				return this.trackList.sort((first, second) => -1*collator.compare(first[column], second[column]));
			}
		}

	},
	props: {
		trackList: Array
	}
}