import React, {useEffect, useState, useMemo} from 'react';

export const ThemeContext = React.createContext({theme: 'black'});
ThemeContext.contextName = 'ThemeContext';

export default {};