import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import ColoredWordHeading from '../ColoredWordHeading'
import IconCard, { IconCardData } from '../IconCard'
import PredictionCardContent from './PredictionCardContent'
import LotteryCardContent from './LotteryCardContent'
import TeamACardContent from './TeamACardContent'
import TeamBCardContent from './TeamBCardContent'
import CompositeImage from '../CompositeImage'

const TransparentFrame = styled.div<{ isDark: boolean }>`
  background: transparent;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-sizing: border-box;
  backdrop-filter: blur(12px);
  border-radius: 72px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 40px;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`

const BottomLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  bottom: -64px;
  max-width: 192px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
`

const TopRightImgWrapper = styled(Flex)`
  position: absolute;
  right: 0;
  top: -64px;

  max-width: 192px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
`

const PredictionCardData: IconCardData = {
  icon: '',
  background: 'linear-gradient(90deg, rgba(60,226,204,1) 43%, rgba(4,172,133,1) 93%);',
  borderColor: '#ff37fe',
  rotation: '-2',
}

const LotteryCardData: IconCardData = {
  icon: '',
  background: 'linear-gradient(90deg, rgba(176,60,226,1) 43%, rgba(158,4,172,1) 93%);',
  borderColor: '#fbff37',
  rotation: '1',
}

const TeamACardData: IconCardData = {
  icon: '',
  background: 'linear-gradient(90deg, rgba(226,224,60,1) 43%, rgba(187,170,6,1) 93%);',
  borderColor: '#5572ff',
  rotation: '-1',
}

const TeamBCardData: IconCardData = {
  icon: '',
  background: 'linear-gradient(90deg, rgba(73,60,226,1) 43%, rgba(8,6,187,1) 93%);',
  borderColor: '#37ff80',
  rotation: '2',
}

const bottomLeftImage = {
  path: '/images/home/prediction-cards/',
  attributes: [{ src: '', alt: '' }],
}

const topRightImage = {
  path: '/images/home/lottery-balls/',
  attributes: [{ src: '', alt: '' }],
}

const WinSection = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <>
      <BgWrapper>
        <BottomLeftImgWrapper>
          <CompositeImage {...bottomLeftImage} />
        </BottomLeftImgWrapper>
        <TopRightImgWrapper>
          <CompositeImage {...topRightImage} />
        </TopRightImgWrapper>
      </BgWrapper>
      <TransparentFrame isDark={theme.isDark}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <ColoredWordHeading textAlign="center" text={t('TowerSwap Team')} mb="50px" />
          <Flex m="0 auto" flexDirection={['column', null, null, 'row']} maxWidth="600px">
            <Flex
              flex="1"
              maxWidth={['275px', null, null, '100%']}
              mr={[null, null, null, '24px']}
              mb={['32px', null, null, '24px']}
            >
              <IconCard {...TeamACardData}>
                <TeamACardContent />
              </IconCard>
            </Flex>
            <Flex
              flex="1"
              maxWidth={['275px', null, null, '100%']}
              mr={[null, null, null, '24px']}
              mb={['32px', null, null, '24px']}
            >
              <IconCard {...TeamBCardData}>
                <TeamBCardContent />
              </IconCard>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Flex m="0 auto" flexDirection={['column', null, null, 'row']} maxWidth="600px">
            <Flex
              flex="1"
              maxWidth={['275px', null, null, '100%']}
              mr={[null, null, null, '24px']}
              mb={['32px', null, null, '0']}
            >
              <IconCard {...PredictionCardData}>
                <PredictionCardContent />
              </IconCard>
            </Flex>
            <Flex
              flex="1"
              maxWidth={['275px', null, null, '100%']}
              mr={[null, null, null, '24px']}
              mb={['32px', null, null, '0']}
            >
              <IconCard {...LotteryCardData}>
                <LotteryCardContent />
              </IconCard>
            </Flex>
          </Flex>
        </Flex>
      </TransparentFrame>
    </>
  )
}

export default WinSection
