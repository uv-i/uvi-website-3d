/**
 * Top-left brand box — sits just below the fixed NavBar (top: 96px = 80px nav + 16px gap).
 */
const TitleHUD = ({ isDark }) => (
  <div style={{
    position: 'absolute',
    top: '96px',
    left:'20px',
    zIndex: 20,
    pointerEvents: 'none'
  }}>
    <div style={{
      background: isDark ? 'rgba(8,8,15,0.72)' : 'rgba(255,246,238,0.82)',
      border: `1px solid ${isDark ? 'rgba(136,85,255,0.25)' : 'rgba(85,0,204,0.15)'}`,
      borderRadius: '12px',
      padding: '10px 16px',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.18em',
        textTransform: 'uppercase', fontWeight: 700,
        color: isDark ? '#8855FF' : '#5500CC',
      }}>
        🏔 Hover over the orb to chat with Leo, our UV-I guide!
      </div>
      {/* <div style={{
        fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.1em',
        marginTop: '3px',
        color: isDark ? 'rgba(200,190,255,0.4)' : 'rgba(80,50,20,0.4)',
      }}>
        Hover over the orb to chat with Leo, our UV-I guide!
      </div> */}
    </div>
  </div>
);

export default TitleHUD;
