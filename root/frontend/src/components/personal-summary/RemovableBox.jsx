import React, { Component } from 'react';
import './RemovableBox.css';
import ClearIcon from '@material-ui/icons/Clear';

export default class RemovableBox extends Component {

    render() {
        return (
            <div className="removableBox">
                {this.props.content}
                <ClearIcon className="customCancelIcon" fontSize="small" onClick={() => {
                    let updatedList = this.props.list.slice();
                    updatedList.splice(updatedList.indexOf(this.props.content), 1);
                    this.props.setList(updatedList);
                }} />
            </div>
        );
    }

}

