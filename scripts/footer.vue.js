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
					<a href="https://www.twitch.tv/Lythero" target="_blank">
						<div class="footerDataLink">
							<img src="./images/twitch_icon_black.svg" alt="twitch icon" height="30" class="footerIcon">Twitch
						</div>
					</a>
					<a href="https://twitter.com/Lythero" target="_blank">
						<div class="footerDataLink">
							<img src="./images/twitter_icon_black.svg" alt="twitter icon" height="22" class="footerIcon">Twitter
						</div>
					</a>
				</div>
			</div>
			<div class="centerFooter">
				<div class="centerFooterText">
					<a href="https://www.youtube.com/c/Lythero" target="_blank">
						<div class="footerDataLink">
							<img src="./images/youtube_icon_black.svg" alt="youtube icon" height="26" class="footerIcon">Youtube Channel
						</div>
					</a>
					<a href="https://www.youtube.com/c/LytheroStreams" target="_blank">
						<div class="footerDataLink">
							<img src="./images/youtube_icon_black.svg" alt="youtube icon" height="26" class="footerIcon">Stream VOD Channel
						</div>
					</a>
				</div>
			</div>
			<div class="rightFooter">
				<div class="rightFooterText">
					<a href="https://www.youtube.com/channel/UCROuhoNylPaQB7vYQYSGTqA" target="_blank">
						<div class="footerDataLink">
							<img src="./images/youtube_icon_black.svg" alt="youtube icon" height="26" class="footerIcon">Out of Context Channel
						</div>
					</a>
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