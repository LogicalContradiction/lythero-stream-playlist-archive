export default {
	name: "DataList",
	template: `
	<div id="dataTable">
		<label for="filterTextEntry"> Filter: </label>
		<input type="text" id="filterTextEntry" :value="textFilter" @input="evt=>textFilter=evt.target.value" :placeholder="textFilterPlaceholderText">
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

			<tr class="tableRow" v-if="this.currentDataView.length > 0" v-for="item in displayData" :key="item.id">
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

			<tr class="tableRow" v-else> 
				<td colspan="5" class="noResultsTableRow"> No results found. Please revise your search and try again. </td>
			</tr>

		</table>
		<div id="resultsPerPageBar">
			Results per page: 
				<span class="selectedResultsPerPage" id="resultsPerPageLeast" @click="resultsPerPageClickHandler('resultsPerPageLeast')">25</span>
				<span class="unselectedResultsPerPage" id="resultsPerPageMid" @click="resultsPerPageClickHandler('resultsPerPageMid')">50</span>
				<span class="unselectedResultsPerPage" id="resultsPerPageMost" @click="resultsPerPageClickHandler('resultsPerPageMost')">100</span>
				<span class="unselectedResultsPerPage" id="resultsPerPageAll" @click="resultsPerPageClickHandler('resultsPerPageAll')">All</span>
		</div>
		<div id="tableNavBar" v-show="this.currentDataView.length > 0">
			<button type="button" id="firstPageButton" class="tableNavButton" @click="goToFirstPage"> &lt&lt </button>
			<button type="button" id="decPageNumButton" class="tableNavButton" @click="decrementPageNum"> &lt </button>
			<span id="pageIndicator" class="pageIndicator" @click="jumpToPageHandler">
				<span class="currentPageNum"> {{ currentPageNum }} </span>
				<span class="pageDivider"> of </span>
				<span class="maxNumPages"> {{ maxNumPages }} </span>
			</span>
			<input type="text" id="jumpPageEntry" v-model="jumpToPageNumEntry" @blur="jumpToPageTextInputUnfocusHandler" @keyup.enter="jumpToPageTextInputEnterHandler" :placeholder="jumpToPageNumPlaceholder">
			<button type="button" id="incPageNumButton" class="tableNavButton" @click="incrementPageNum"> &gt </button>
			<button type="button" id="lastPageButton" class="tableNavButton" @click="goToLastPage"> &gt&gt </button>
		</div>
	</div>
	`,
	data(){
		return {
			textFilter: "",
			textFilterPlaceholderText: "Enter text to filter table",

			currentDataView: this.trackList,

			ascending: true,
			currentSortColumn: 'songTitle',

			currentPageNum: 1,
			numEntriesPerPage: 25,
			currentNumEntriesPerPageID: "resultsPerPageLeast",
			maxNumPages: Math.ceil(this.trackList.length / 25),

			jumpToPageNumPlaceholder: "Page #: 1-" + Math.ceil(this.trackList.length / 25),
			jumpToPageNumEntry: "",
			canJumpPages: true,

		};
	},
	computed: {
		displayData(){
			//now sort the results according to the current sort
			let collator = new Intl.Collator("en", {sensitivity: "base"});
			if(this.ascending){
				this.currentDataView.sort((first, second) =>collator.compare(first[this.currentSortColumn], second[this.currentSortColumn]));
			}
			else{
				//collator returns positive if first is first, negavite if second is first, and 0 if equal. Negate the result to invert
				this.currentDataView.sort((first, second) => -1*collator.compare(first[this.currentSortColumn], second[this.currentSortColumn]));
			}
			return this.getPageOfData()
		}

	},
	methods: {
		basicFiltering(){
			if(this.textFilter !== ""){
				let searchText = this.textFilter.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
				this.currentDataView = this.trackList.filter((element) => (element.songTitle.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1) || (element.playerName.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1))
			}
			return
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
			//this.currentPageNum = 1;
			//hide the decrement buttons
			this.goToFirstPage();
		},
		getPageOfData(){
			let startIndex = (this.currentPageNum - 1) * this.numEntriesPerPage;
			let endIndex = this.currentPageNum * this.numEntriesPerPage;

			return this.currentDataView.slice(startIndex, endIndex);
		},
		incrementPageNum(){
			if(!(this.currentPageNum+1 > this.maxNumPages)){
				//check to see if decrement buttons need to be unhid
				if(this.currentPageNum === 1){
					this.unhideDecrementButtons();
				}
				this.currentPageNum++;
				//check to hide increment buttons here
				if(this.currentPageNum === this.maxNumPages){
					this.hideIncrementButtons();
				}
				//now scroll to top
				this.scrollToTopofTable();
			}
		},
		decrementPageNum(){
			if(!(this.currentPageNum-1 <= 0)){
				//check to see if increment buttons need to be unhid
				if(this.currentPageNum === this.maxNumPages){
					this.unhideIncrementButtons();
				}
				this.currentPageNum--;
				//check to hide decrement buttons here
				if(this.currentPageNum === 1){
					this.hideDecrementButtons();
				}
			}
			//now scroll to top
			this.scrollToTopofTable();
		},
		resultsPerPageClickHandler(newID){
			if(newID !== this.currentNumEntriesPerPageID){
				let idLookup = {
					"resultsPerPageLeast": 25,
					"resultsPerPageMid": 50,
					"resultsPerPageMost": 100,
					"resultsPerPageAll": this.trackList.length
				};
				//set the new page amount
				this.changeNumEntriesPerPage(idLookup[newID]);
				//change the old id's class to unchosen
				document.getElementById(this.currentNumEntriesPerPageID).className = "unselectedResultsPerPage";
				//change the new id's class to chosen
				document.getElementById(newID).className = "selectedResultsPerPage";
				//update the page amount id
				this.currentNumEntriesPerPageID = newID;
			}
		},
		changeNumEntriesPerPage(newNumEntries){
			if(this.numEntriesPerPage != newNumEntries){
				//this.currentPageNum = 1;
				this.goToFirstPage();
				this.numEntriesPerPage = newNumEntries;
			}
		},
		setMaxNumPages(){
			this.maxNumPages = Math.ceil(this.currentDataView.length / this.numEntriesPerPage);
			//now update the placeholder text for jumping to a page
			this.jumpToPageNumPlaceholder = "Page #: 1-" + this.maxNumPages;
			//if the max number of pages is 1, hide the buttons since there are no other pages
			if (this.maxNumPages === 1){
				this.hideDecrementButtons();
				this.hideIncrementButtons();
				//and disable jumping
				this.canJumpPages = false;
				//also remove the class on the page indicator since it's no longer clickable
				document.getElementById("pageIndicator").className = "";
			}
			else{
				this.unhideIncrementButtons();
				if(!this.canJumpPages){
					this.canJumpPages = true;
				}
				//reenable the hover
				if(document.getElementById("pageIndicator").className !== "pageIndicator"){
					document.getElementById("pageIndicator").className = "pageIndicator";
				}
			}
		},
		goToFirstPage(){
			//consider using this function wherever I want to return to the first page in other functions
			if(this.currentPageNum != 1){
				this.currentPageNum = 1;
				//hide the decrement button here
				this.hideDecrementButtons()
				this.unhideIncrementButtons();
				//now scroll to top
				this.scrollToTopofTable();
			}
		},
		goToLastPage(){
			if(this.currentPageNum != this.maxNumPages){
				this.currentPageNum = this.maxNumPages;
				this.hideIncrementButtons();
				this.unhideDecrementButtons();
				//now scroll to top
				this.scrollToTopofTable();
			}
		},
		hideDecrementButtons(){
			//hide both firstPageButton and decPageNumButton
			this.hideButton("firstPageButton");
			this.hideButton("decPageNumButton");			
		},
		unhideDecrementButtons(){
			this.unhideButton("firstPageButton");
			this.unhideButton("decPageNumButton");
		},
		hideIncrementButtons(){
			this.hideButton("lastPageButton");
			this.hideButton("incPageNumButton");
		},
		unhideIncrementButtons(){
			this.unhideButton("lastPageButton");
			this.unhideButton("incPageNumButton");
		},
		hideButton(buttonID){
			let button = document.getElementById(buttonID);
			if(button.style.visibility !== "hidden"){
				button.style.visibility = "hidden";
			}
		},
		unhideButton(buttonID){
			let button = document.getElementById(buttonID);
			if(button.style.visibility !== "visible"){
				button.style.visibility = "visible";
			}
		},
		jumpToPageHandler(){
			if(this.canJumpPages){
				//first hide the page indicator
				document.getElementById("pageIndicator").style.display = "none";
				//now unhide the textbox
				document.getElementById("jumpPageEntry").style.display = "inline";
				//and set the focus to the textbox
				document.getElementById("jumpPageEntry").focus()
			}
		},
		jumpToPageTextInputUnfocusHandler(){
			//this will cancel the jump, so just switch the hide elements
			this.returnNavbarText();
		},
		jumpToPageTextInputEnterHandler(){
			if(this.jumpToPageNumEntry !== ""){
				this.goToPage(this.jumpToPageNumEntry);
				this.jumpToPageNumEntry = "";
			}
			//now return the navbar to text
			this.returnNavbarText();
			//now scroll to top
			this.scrollToTopofTable();
		},
		returnNavbarText(){
			//rehide the textbox
			document.getElementById("jumpPageEntry").style.display = "none";
			//unhide the indicator
			document.getElementById("pageIndicator").style.display = "inline";
		},
		goToPage(pageNumString){
			//convert string rep of number into integer
			let newPageNum = parseInt(pageNumString);
			//now check that this is a valid page number
			//not NaN, not < 1, and not > max number of pages
			if(isNaN(newPageNum) || newPageNum < 1 || newPageNum > this.maxNumPages){
				return
			}
			//valid page number, go to it.
			//first unhide the buttons if we were on the first or last page
			if(this.currentPageNum === 1){
				this.unhideDecrementButtons();
			}
			else if(this.currentPageNum === this.maxNumPages){
				this.unhideIncrementButtons();
			}
			//now change page number
			if(newPageNum === 1){
				this.goToFirstPage();
			}
			else if(newPageNum === this.maxNumPages){
				this.goToLastPage();
			}
			else{
				this.currentPageNum = newPageNum;
			}
		},
		scrollToTopofTable(){
			document.getElementById("filterTextEntry").scrollIntoView({behavior: "smooth"});
		}
	},
	watch: {
		textFilter(){
			this.goToFirstPage();
			if(this.textFilter !== ""){
				let searchText = this.textFilter.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
				this.currentDataView = this.trackList.filter((element) => 
					(element.songTitle.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1) || //song title
					(element.playerName.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1) || //name in player
					(element.sourceMedia.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1) || //source media
					(element.album.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().indexOf(searchText) != -1)  //album
				)
			}
			else{
				this.currentDataView = this.trackList;
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
	//Text w/ click handler to change number of results per page
	//Tell user number of pages there are
}