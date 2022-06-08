export default {
	name: 'Footer',
	template: `
	<br><br><br>
	<hr/>
	<div id="footerLabelText"> Lythero's Links: <br> </div>
	<div id="footer">
		<div class="leftFooter">
			<div class="leftFooterText">
				<a href="https://www.twitch.tv/Lythero" target="_blank" class="footerRow twitchFooterRow"><img src="./images/twitch_icon_black.svg" height="31" class="footerIcon">Twitch</a><br>
				<a href="https://twitter.com/Lythero" target="_blank" class="footerRow twitterFooterRow"><img src="./images/twitter_icon_black.svg" height="22" class="footerIcon">Twitter</a><br>
			</div>
		</div>
		<div class="centerFooter">
			<div class="centerFooterText">
				<a href="https://www.youtube.com/c/Lythero" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" height="26" class="footerIcon">Youtube Channel</a><br>
				<a href="https://www.youtube.com/c/LytheroStreams" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" height="26" class="footerIcon">Stream VOD Channel</a><br>
			</div>
		</div>
		<div class="rightFooter">
			<div class="rightFooterText">
				<a href="https://www.youtube.com/channel/UCROuhoNylPaQB7vYQYSGTqA" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" height="26" class="footerIcon">Out of Context Channel</a><br>
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