import React from 'react';
import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

function AnimatedLogo() {
    return (
        <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
            <Code2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
    );
}

export default AnimatedLogo;
