import {useEffect, useState} from 'react';
import PullToRefresh from 'pulltorefreshjs';

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * @deprecated Only supported on Chrome and Android Webview.
 */
interface BeforeInstallPromptEvent extends Event {

	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: Array<string>;

	/**
	 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
	 */
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed',
		platform: string
	}>;

	/**
	 * Allows a developer to show the install prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>;

}

export function useInstallPrompt(): [boolean, () => void] {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [isInstallable, setIsInstallable] = useState<boolean>(false);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			const promptEvent = e as BeforeInstallPromptEvent;
			setDeferredPrompt(promptEvent);
			setIsInstallable(true);
		};

		// Check if the app is running in standalone mode
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
		// Check if the app is already installed
		// @ts-ignore
		const isPWA = window.navigator.standalone || isStandalone;

		// If the app is not in standalone mode and the event is not available, we can't show the prompt
		if (!isPWA && !('BeforeInstallPromptEvent' in window)) {
			setIsInstallable(false);
			return;
		}

		// Listen for the beforeinstallprompt event
		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		};
	}, []);

	const promptInstall = () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the install prompt');
				} else {
					console.log('User dismissed the install prompt');
				}
				setDeferredPrompt(null);
			});
		}
	};

	return [isInstallable, promptInstall];
}

export function usePullToRefresh() {
	useEffect(() => {
		// Check if the app is running in standalone mode on iOS
		// @ts-ignore
		const isInWebAppiOS = (window.navigator.standalone === true);

		if (isInWebAppiOS) {
			PullToRefresh.init({
				mainElement: 'body',
				onRefresh() {
					window.location.reload();
				},
			});

			return () => {
				PullToRefresh.destroyAll();
			};

		} else {
			let startY: number = 0;
			let startScrollY: number = 0;

			const handleTouchStart = (event: TouchEvent) => {
				if (event.touches.length === 1) {
					startY = event.touches[0].clientY;
					startScrollY = window.scrollY;
				}
			};

			const handleTouchMove = (event: TouchEvent) => {
				if (event.touches.length === 1) {
					const currentY = event.touches[0].clientY;
					const pullDistance = currentY - startY;

					// Only consider pull-to-refresh if user pulls down more than the viewport height
					if (startScrollY === 0 && pullDistance > window.innerHeight) {
						// Prevent the default action to avoid the browser's default behavior
						event.preventDefault();
						// Reload the page
						window.location.reload();
					}
				}
			};

			// Add event listeners for touch start and move
			document.addEventListener('touchstart', handleTouchStart, {passive: false});
			document.addEventListener('touchmove', handleTouchMove, {passive: false});

			return () => {
				// Clean up event listeners
				document.removeEventListener('touchstart', handleTouchStart);
				document.removeEventListener('touchmove', handleTouchMove);
			};
		}
	}, []);
}
