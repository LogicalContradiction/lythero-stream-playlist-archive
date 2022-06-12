export default {
	name: 'Footer',
	template: `
	<footer id="footer">
		<hr/>
		<div id="footerTextBox">
			<div id="footerLabelText"> Lythero's Links:</div>
		</div>
		<div id="footerLinks">
			<div class="leftFooter">
				<div class="leftFooterText">
					<div class="footerDataLink">
						<a href="https://www.twitch.tv/Lythero" target="_blank"><img src="./images/twitch_icon_black.svg" alt="twitch icon" height="30" class="footerIcon">Twitch</a>
					</div>
					<div class="footerDataLink">
						<a href="https://twitter.com/Lythero" target="_blank"><img src="./images/twitter_icon_black.svg" alt="twitter icon" height="22" class="footerIcon">Twitter</a>
					</div>
				</div>
			</div>
			<div class="centerFooter">
				<div class="centerFooterText">
					<div class="footerDataLink">
						<a href="https://www.youtube.com/c/Lythero" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" alt="youtube icon" height="26" class="footerIcon">Youtube Channel</a>
					</div>
					<div class="footerDataLink">
						<a href="https://www.youtube.com/c/LytheroStreams" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" alt="youtube icon" height="26" class="footerIcon">Stream VOD Channel</a>
					</div>
				</div>
			</div>
			<div class="rightFooter">
				<div class="rightFooterText">
					<div class="footerDataLink">
						<a href="https://www.youtube.com/channel/UCROuhoNylPaQB7vYQYSGTqA" target="_blank" class="footerRow youtubeFooterRow"><img src="./images/youtube_icon_black.svg" alt="youtube icon" height="26" class="footerIcon">Out of Context Channel</a>
					</div>
				</div>
			</div>
		</div>
	</footer>
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