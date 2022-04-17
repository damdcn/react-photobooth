import cx from "classnames";
import React, {useEffect} from "react";

const Button = (props) => {

    const {
        label,
        className,
        loading,
        onClick
    } = props;



    return (
        <>
            {
                !loading
                && (
                    <button
                        onClick={onClick}
                        className={className}
                    >
                        {label}
                    </button>
                )

            }
        </>
    )

}

Button.defaultProps = {
  loading: false
};

export default Button;