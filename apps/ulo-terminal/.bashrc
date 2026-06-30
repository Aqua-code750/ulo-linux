# a) Purpose: Custom Bash configuration for Ulo Linux.
# c) Install/Test: Place in ~/.bashrc
# d) Open decisions: The "ulo" command acts as a wrapper for pacman/aur and the AI agent.

# --- Ulo Terminal Defaults ---
export EDITOR="nano"
export VISUAL="nano"
export TERM="alacritty"

# --- Ulo Custom Prompt (Neon colors) ---
# PS1 styled with Ulo Cyan and Green
PS1='\[\e[1;36m\]ulo@\h\[\e[0m\]:\[\e[1;32m\]\w\[\e[0m\]\$ '

# --- Aliases ---
alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias update='ulo update'
alias install='ulo install'
alias search='ulo search'

# --- Ulo Agent Hook ---
# If a command fails, the agent can automatically suggest a fix.
# Usage: Type '?' after a failed command, e.g., `$ ?`
ulo_agent_help() {
    local last_err=$?
    if [ $last_err -ne 0 ]; then
        echo -e "\e[1;33m[Ulo Agent]\e[0m Analyzing previous error..."
        ulo-cli analyze --exit-code $last_err --history "$(history 1)"
    else
        echo -e "\e[1;33m[Ulo Agent]\e[0m How can I help? (Type a natural language request)"
        read -e -p "> " query
        ulo-cli ask "$query"
    fi
}
alias ?='ulo_agent_help'

# Load external scripts (like fzf, nvm, uv) if present
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi
