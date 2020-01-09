import React from 'react';

const basicForm = props => {
    return (
        <>
            <h3>{props.title}</h3>
            <form onSubmit={props.clicked}>
                <input
                    type={props.inputType}
                    value={props.value}
                    name={props.name}
                    onChange={props.changed}
                />
                <input type="submit" value="Neste" />
            </form>
        </>
    );
};

export default basicForm;
