import React from 'react';

import classes from './BasicForm.module.scss';

const basicForm = props => {
    return (
        <>
            <div className={classes.BasicForm__title}>{props.title}</div>
            <form className={classes.BasicForm} onSubmit={props.next}>
                <input
                    type={props.inputType}
                    value={props.value}
                    name={props.name}
                    onChange={props.changed}
                    className="Input"
                />
                <div className={classes.BasicForm__buttons}>
                    {props.last ? (
                        <button
                            className="Button Button--inverse"
                            onClick={props.previous}
                        >
                            Forrige
                        </button>
                    ) : null}

                    <input type="submit" className="Button" value="Videre" />
                </div>
            </form>
        </>
    );
};

export default basicForm;
