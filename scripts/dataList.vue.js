export default {
	name: "DataList",
	template: `
	<label for="filterTextEntry"> Filter: </label>
	<input type="text" id="filterTextEntry" v-model="textFilter" :placeholder="textFilterPlaceholderText">
	<button type="button" @click="clearButtonHandler">Clear</button>
	<table>
		<tr>
			<th class="sortableHeader" @click="sortTrackData('songTitle')" @mouseenter="tableHeaderMouseEnterHandler('songTitle')" @mouseleave="tableHeaderMouseExitHandler('songTitle')"> {{ this.songTitle }} </th>
			<th class="sortableHeader" @click="sortTrackData('playerName')" @mouseenter="tableHeaderMouseEnterHandler('playerName')" @mouseleave="tableHeaderMouseExitHandler('playerName')"> {{ this.playerName }} </th>
			<th class="sortableHeader" @click="sortTrackData('sourceMedia')" @mouseenter="tableHeaderMouseEnterHandler('sourceMedia')" @mouseleave="tableHeaderMouseExitHandler('sourceMedia')"> {{ this.sourceMedia }} </th>
			<th class="sortableHeader" @click="sortTrackData('album')" @mouseenter="tableHeaderMouseEnterHandler('album')" @mouseleave="tableHeaderMouseExitHandler('album')"> {{ this.album }} </th>
			<th> {{ this.otherInfo }} </th>
		</tr>
		<tr>
			<td>
				<div id="notesText0" @click="notesClick(0)"> Click to show notes▸ </div>
				<div class="hidden" id="hidden0"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vulputate hendrerit nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec arcu massa, aliquam auctor iaculis vel, eleifend non erat. Vivamus a mi sed tortor elementum tincidunt. Curabitur finibus finibus ornare. Mauris bibendum ut nulla pretium viverra. Suspendisse tempor at risus quis rutrum. Nam auctor lorem condimentum ipsum consequat finibus. Proin sit amet lacus id arcu accumsan ultricies posuere ut lacus. Etiam lobortis, nisi a hendrerit ultrices, leo lorem maximus lacus, in molestie ex ante et tellus. Phasellus ultricies in est facilisis tristique. Nam venenatis metus nisl, congue malesuada nisi elementum nec. Phasellus dapibus libero et elit ultricies bibendum. Ut volutpat magna quis nunc sagittis placerat. Aliquam mattis ex vitae ultrices ultrices. </div>
			</td>
			<td class="sortableHeader" @click="headerLabelClickHandler('songTitle', 'songTitleTriangle')" @mouseenter="mouseEnterHiddenTest('songTitle', 'songTitleTriangle')" @mouseleave="mouseLeaveHiddenTest('songTitle', 'songTitleTriangle')"> Title <div class="triangle" id="songTitleTriangle"> ▾ </div>
			</td>
			<td class="sortableHeader" @click="headerLabelClickHandler('playerName', 'playerNameTriangle')" @mouseenter="mouseEnterHiddenTest('playerName', 'playerNameTriangle')" @mouseleave="mouseLeaveHiddenTest('playerName', 'playerNameTriangle')"> Name in Player <div class="triangle" id="playerNameTriangle"> ▾ </div>
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
			songTitle: "Title▾",
			playerName: "Name in Player",
			sourceMedia: "Source Media",
			album: "Album",
			otherInfo: "Additional Info",

			textFilter: "",
			textFilterPlaceholderText: "Song Title or Name in Player",

			ascending: true,
			currentSortColumn: 'songTitle',

			testascending: true,
			testcurrentSortColumn: 'songTitle',

			plainLabels: {songTitle: "Title", 
						  playerName: "Name in Player", 
						  sourceMedia: "Source Media",
						  album: "Album",
						 },
			ascendingSortLabels: {songTitle: "Title▾", 
								  playerName: "Name in Player▾", 
								  sourceMedia: "Source Media▾",
								  album: "Album▾",
								 },
			descendingSortLabels: {songTitle: "Title▴", 
								   playerName: "Name in Player▴", 
								   sourceMedia: "Source Media▴",
								   album: "Album▴",
								  }

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
		sortTrackData(newSortField){
			console.log("method sort");
			let collator = new Intl.Collator("en", {sensitivity: "base"});
			//compare using base so letters with diacrits are equal and case insensitive
			//consider setting "numeric" option to true to do numeric comparisons ie 1>2>10
			//consider setting "ignorePunctuation" option to true to ignore punctuation
			if(this.clickedOnSameColumn(newSortField)){
				console.log("invert ascending")
				//clicked on same column, so invert it
				this.ascending = !this.ascending;
				console.log("ascending:", this.ascending)
			}
			else if(!this.ascending){
				console.log("ascending for new column")
				this.ascending = true;
				console.log("ascending:", this.ascending)
			}
			//update the header labels
			this.changeHeaderLabel(newSortField)
			//update the sortByColumn
			this.updateCurrentSortByColumn(newSortField)
			//ascending: true -> top=a, bottom=z
			if(this.ascending){
				return this.trackList.sort((first, second) =>collator.compare(first[newSortField], second[newSortField]));
			}
			else{
				//collator returns positive if first is first, negavite if second is first, and 0 if equal. Negate the result to invert
				return this.trackList.sort((first, second) => -1*collator.compare(first[newSortField], second[newSortField]));
			}
		},
		changeHeaderLabel(headerKey){
			console.log("change header")
			console.log("headerKey=",headerKey)
			console.log("this[headerKey]=",this[headerKey])
			if(this.clickedOnSameColumn(headerKey)){
				if(this.ascending){
					console.log("same column, ascending now")
					//same column, ascending order now
					this[headerKey] = this.ascendingSortLabels[headerKey];
				}
				else{
					//same column, descending order now
					console.log("same column, decending now")
					this[headerKey] = this.descendingSortLabels[headerKey];
					console.log("this[headerKey]=",this[headerKey])
				}
			}
			else{
				//different column, will always be ascending
				//change the old column label
				console.log("new column")
				this[this.currentSortColumn] = this.plainLabels[this.currentSortColumn];
				//change the new column label
				this[headerKey] = this.ascendingSortLabels[headerKey];
			}
		},
		clickedOnSameColumn(sortByField){
			return this.currentSortColumn == sortByField;
		},
		updateCurrentSortByColumn(newSortBy){
			if(this.currentSortColumn != newSortBy){
				this.currentSortColumn = newSortBy
			}
		},
		tableHeaderMouseEnterHandler(column){
			if(this.currentSortColumn != column){
				this[column] = this.ascendingSortLabels[column];
			}
			else{
				if(this.ascending){
					this[column] = this.descendingSortLabels[column];
				}
				else{
					this[column] = this.ascendingSortLabels[column];
				}
			}
		},
		tableHeaderMouseExitHandler(column){
			if(this.currentSortColumn != column){
				this[column] = this.plainLabels[column];
			}
			else{
				if(this.ascending){
					this[column] = this.ascendingSortLabels[column];
				}
				else{
					this[column] = this.descendingSortLabels[column];
				}
			}
		},
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
		mouseEnterHiddenTest(column, triangleID){
			console.log("test enter called")
			if(this.testcurrentSortColumn != column){
				console.log("sorting by different")
				//not sorting by this column, so just show the arrow
				document.getElementById(triangleID).style.visibility = "visible";
			}
			else{
				console.log("sorting by same")
				//currently sorting by this column, so it's already visible
				if(this.testascending){
					//show descending arrow
					document.getElementById(triangleID).innerText = "▴";
				}
				else{
					//show ascending arrow
					document.getElementById(triangleID).innerText = "▾"
				}
			}
		},
		mouseLeaveHiddenTest(column, triangleID){
			console.log("test exit called")
			if(this.testcurrentSortColumn != column){
				console.log("sorting by different")
				//not sorting by this column, so just hide the arrow
				document.getElementById(triangleID).style.visibility = "hidden";
			}
			else{
				console.log("sorting by same")
				//sorting by this column, so it's already visible
				if(this.testascending){
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
			if(this.testcurrentSortColumn == column){
				//this is the same column
				if(this.testascending){
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
				let oldsortTriangle = this.testcurrentSortColumn + "Triangle";
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
			if(this.testcurrentSortColumn == column){
				//clicked on same column, so invert ascending
				this.testascending = !this.testascending;
			}
			else{
				//clicked on different column, set ascending to true
				this.testascending = true;
			}
			//update the labels
			this.headerLabelChangeTest(column, triangleID);
			//update the sortByColumn
			if(this.testcurrentSortColumn != column){
				this.testcurrentSortColumn = column;
			}
			//do sorting here
		}

	},
	props: {
		trackList: Array
	}
}