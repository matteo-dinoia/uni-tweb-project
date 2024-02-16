package json.errors;

public class FatalError extends Error{
    private final int errorCode;
    private final String debugErrorMsg;

    public FatalError(int errorCode, String errorMsg, String debugErrorMsg){
        super(errorMsg);
        this.errorCode = errorCode;
        this.debugErrorMsg = debugErrorMsg;
    }

    public FatalError(int errorCode, String errorMsg){
        super(errorMsg);
        this.errorCode = errorCode;
        this.debugErrorMsg = null;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public String getDebugErrorMsg() {
        return debugErrorMsg;
    }
}
