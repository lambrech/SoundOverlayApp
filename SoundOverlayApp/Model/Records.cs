namespace SoundOverlayApp.Model;

public record SoundBase(string DisplayName);

public record StoredSound(string DisplayName, string StoredPath) : SoundBase(DisplayName);

public record SilenceSound(string DisplayName, TimeSpan Duration, bool WithHalfTimeBeep) : SoundBase(DisplayName);

