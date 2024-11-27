import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Link } from 'react-router-dom' // Import BrowserRouter
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const StyledLink = styled(Link)`
`

const StyledButton = styled(Button)`
    font-family: 'Work Sans', sans-serif,
`

const LaunchButton: React.FC<ButtonProps> = ({ ...props }) => {
    const { t } = useTranslation()
    return (
    <Router> {/* Wrap your component with Router */}
        <StyledLink to="/swap">
            <StyledButton {...props}>{t('Launch App')}</StyledButton>
        </StyledLink>
    </Router>
    )
}

export default LaunchButton
