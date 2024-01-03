package json.errors;

public class FatalError extends Error{
    public final int errorCode;
    public final String debugErrorMsg; //TODO make private

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
}
