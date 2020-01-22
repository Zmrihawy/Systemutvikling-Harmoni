import React from 'react';
import Type from '../UI/Type/Type';

import classes from './BasicForm.module.scss';

const basicForm = props => {
    return (
        <>
            <div className="MediumTitle">
                <Type strings={props.title} speed={50} />
            </div>
            <form className={classes.BasicForm} onSubmit={props.next}>
                <input
                    type={props.inputType}
                    value={props.value}
                    name={props.name}
                    onChange={props.changed}
                    className="Input"
                    required
                />
                <div className={classes.BasicForm__buttons}>
                    {props.last ? (
                        <button
                            className="Button Button--inverse"
                            onClick={props.previous}
                        >
                            &larr; Tilbake
                        </button>
                    ) : null}

                    <input
                        autoFocus
                        type="submit"
                        className="Button"
                        value="Neste &rarr;"
                    />
                </div>
            </form>
        </>
    );
};

export default basicForm;
