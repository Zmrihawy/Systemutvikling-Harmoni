import React from 'react';

import Type from '../UI/Type/Type';
import classes from './DescriptionAdder.module.scss';

const descriptionAdder = props => {
    return (
        <div className={classes.DescriptionAdder}>
            <div className="MediumTitle">
                <Type strings={props.title} speed={50} />
            </div>
            <form onSubmit={props.next}>
                <textarea
                    rows="12"
                    cols="100"
                    value={props.value}
                    name="description"
                    onChange={props.changed}
                    className="Input"
                    style={{ fontSize: '1.6rem' }}
                    required
                ></textarea>
                <div>
                    <button
                        className="Button Button--inverse"
                        onClick={props.previous}
                    >
                        &larr; Tilbake
                    </button>

                    <input
                        autoFocus
                        type="submit"
                        className="Button"
                        value="Neste &rarr;"
                    />
                </div>
            </form>
        </div>
    );
};

export default descriptionAdder;
