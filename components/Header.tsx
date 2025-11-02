import { Search, Bell, Plus, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header 
      className="fixed top-0 right-0 z-40 flex items-center justify-between"
      style={{
        width: '100%',
        height: '88px',
        background: '#FFFFFF',
        boxShadow: '0px 2px 8px rgba(90, 56, 37, 0.12)',
        paddingLeft: 'clamp(16px, 5vw, 40px)',
        paddingRight: 'clamp(16px, 5vw, 40px)',
      }}
    >
      {/* Mobile Menu Button - Only on Mobile/Tablet */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-[#F8EBD7] rounded-lg transition-colors"
      >
        <Menu size={24} color="#C44569" />
      </button>

      {/* LEFT SECTION - Enhanced Logo */}
      <div className="flex items-center relative">
        <h1 
          className="text-lg sm:text-xl lg:text-2xl"
          style={{
            fontFamily: 'Playfair Display',
            fontWeight: 600,
            color: '#C44569',
          }}
        >
          <span className="hidden sm:inline">Emily Bakes Cakes</span>
          <span className="sm:hidden">EBC</span>
        </h1>
      </div>

      {/* CENTER SECTION - Premium Search Bar - Hidden on Mobile */}
      <div 
        className="hidden md:flex items-center relative transition-all duration-200"
        style={{
          width: 'min(480px, 40vw)',
          height: '52px',
          background: '#F8EBD7',
          borderRadius: '12px',
          border: searchFocused ? '2px solid #C44569' : '2px solid transparent',
        }}
      >
        {/* Search Icon */}
        <Search 
          size={20} 
          color="#5A3825"
          style={{
            position: 'absolute',
            left: '16px',
          }}
        />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search orders, customers, products..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            paddingLeft: '48px',
            paddingRight: '60px',
            fontFamily: 'Open Sans',
            fontSize: '15px',
            color: '#5A3825',
          }}
          className="placeholder:text-[#5A3825] placeholder:opacity-60"
        />

        {/* Keyboard Shortcut - Hidden on Tablet */}
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute',
            right: '16px',
            fontFamily: 'Open Sans',
            fontWeight: 500,
            fontSize: '13px',
            color: '#5A3825',
            opacity: 0.6,
            background: 'rgba(90, 56, 37, 0.08)',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
        >
          ⌘K
        </div>
      </div>

      {/* Mobile Search Button - Only on Mobile */}
      <button className="md:hidden p-2 hover:bg-[#F8EBD7] rounded-lg transition-colors">
        <Search size={20} color="#C44569" />
      </button>

      {/* RIGHT SECTION - Premium User Controls */}
      <div className="flex items-center gap-4 md:gap-6 lg:gap-7">
        {/* 1. Quick Actions Menu - Hidden on Mobile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center justify-center transition-all duration-200"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#C44569',
            boxShadow: '0px 2px 8px rgba(196, 69, 105, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0px 4px 16px rgba(196, 69, 105, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0px 2px 8px rgba(196, 69, 105, 0.3)';
          }}
        >
          <Plus size={20} color="white" strokeWidth={2.5} />
        </motion.button>

        {/* 2. Notifications Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="relative"
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Bell Icon */}
          <Bell size={24} color="#2B2B2B" strokeWidth={1.5} />
          
          {/* Notification Badge */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: '8px',
              right: '8px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#C44569',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '10px',
                color: 'white',
              }}
            >
              3
            </span>
          </div>
        </motion.button>

        {/* 3. User Profile Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="relative"
          style={{
            filter: 'drop-shadow(0px 2px 8px rgba(90, 56, 37, 0.12))',
          }}
        >
          {/* Avatar Circle */}
          <div
            className="flex items-center justify-center relative"
            style={{
              width: 'clamp(40px, 10vw, 48px)',
              height: 'clamp(40px, 10vw, 48px)',
              borderRadius: '50%',
              background: '#C44569',
              border: '3px solid white',
            }}
          >
            {/* Initials */}
            <span
              className="text-sm lg:text-base"
              style={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                color: 'white',
              }}
            >
              EB
            </span>

            {/* Status Dot */}
            <div
              className="absolute"
              style={{
                bottom: '0px',
                right: '0px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                border: '3px solid white',
              }}
            />
          </div>
        </motion.button>
      </div>
    </header>
  );
}
