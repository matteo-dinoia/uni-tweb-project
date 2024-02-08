import React from "react";
import {ViewableElement} from "../../util/interfaces.ts";

export interface BasicGlasspanePropI{
    closeHandler : () => void;
    confirmHandler : (obtained: ViewableElement | undefined) => void;
}

export function closeOnClickOutside (closeHandler : () => void, event : React.MouseEvent<HTMLElement>) {
    if(event.target !== event.currentTarget)
        return;
    closeHandler();
}