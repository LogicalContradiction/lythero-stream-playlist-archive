export default {
	name: 'Footer',
	template: `
	<br><br><br>
	<hr/>
	<div id="footerTextBox">
		<div id="footerLabelText"> Lythero's Links: <br> </div>
	</div>
	<div id="footer">
		<div class="leftFooter">
			<div class="leftFooterText">
				<div class="testFooter">
					<a href="https://www.twitch.tv/Lythero" target="_blank"><img src="./images/twitch_icon_black.svg" height="30" class="footerIcon">Twitch</a>
				</div>
				<div class="testFooter">
					<a href="https://twitter.com/Lythero" target="_blank"><img src="./images/twitter_icon_black.svg" height="22" class="footerIcon">Twitter</a>
				</div>
			</div>
		</div>
		<div class="centerFooter">
			<div class="centerFooterText">
				<div class="testFooter">
					<a href="https://www.youtube.com/c/Lythero" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" height="26" class="footerIcon">Youtube Channel</a>
				</div>
				<div class="testFooter">
					<a href="https://www.youtube.com/c/LytheroStreams" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" height="26" class="footerIcon">Stream VOD Channel</a>
				</div>
			</div>
		</div>
		<div class="rightFooter">
			<div class="rightFooterText">
				<div class="testFooter">
					<a href="https://www.youtube.com/channel/UCROuhoNylPaQB7vYQYSGTqA" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" height="26" class="footerIcon">Out of Context Channel</a>
				</div>
			</div>
		</div>
	</div>

	`,
	data(){
		return {

		}
	},
	computed: {

	},
	methods: {

	},
	watch: {

	},
	props: {

	}
}