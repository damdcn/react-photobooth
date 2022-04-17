import cx from "classnames";
import React, {useEffect} from "react";

const Flash = (props) => {

    const {
        show,
        delay,
        duration
    } = props;
    
    useEffect(() => {
        const flash = document.querySelector('.flash');

        if (show) {
            setTimeout(() => {
                flash.classList.remove('hidden')
                flash.setAttribute('on', "");
            }, delay)

            setTimeout(() => {
                flash.setAttribute('off', "");
                flash.addEventListener('animationend', () => {
                    flash.removeAttribute('on')
                    flash.removeAttribute('off')
                    flash.classList.add('hidden');
                }, { once: true });
            }, delay + duration)
        }
    }, [delay, duration, show])

    return (
        <div className="flash hidden"/>
    )

}

export default Flash;