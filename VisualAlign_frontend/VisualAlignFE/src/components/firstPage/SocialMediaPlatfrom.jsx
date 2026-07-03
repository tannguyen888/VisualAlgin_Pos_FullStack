import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faFacebook, faInstagram, faSpotify, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faWeixin } from '@fortawesome/free-brands-svg-icons/faWeixin';
function SocialMediaPlatform() {
    return (
        <div className="flex justify-center w-full bg-black p-4 rounded shadow">
            <ul className="flex gap-2 text-sm text-gray-300">
                <li><FontAwesomeIcon icon={faFacebook} /></li>
                <li><FontAwesomeIcon icon={faInstagram} /></li>
                <li><FontAwesomeIcon icon={faSpotify} /></li>
                <li><FontAwesomeIcon icon={faYoutube} /></li>
                <li><FontAwesomeIcon icon={faWeixin} /></li>
                <li><FontAwesomeIcon icon={faDiscord} /></li>
                <li><FontAwesomeIcon icon={faWhatsapp} /></li>
            </ul>
        </div>
    );
}

export default SocialMediaPlatform;